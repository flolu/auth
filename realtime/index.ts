import axios from 'axios'
import * as cookie from 'cookie'
import {createServer, IncomingMessage} from 'http'
import * as jwt from 'jsonwebtoken'
import {Socket} from 'net'
import * as WebSocket from 'ws'

import {AccessToken, Cookies, RefreshTokensServer} from '@shared'

interface AugmentedSocket extends WebSocket {
  accessToken: AccessToken
  refreshToken: string
  refreshLoop: NodeJS.Timeout
}

const server = createServer((_req, res) => {
  res.statusCode = 200
  res.write('realtime')
  res.end()
})

const wss = new WebSocket.Server({noServer: true})

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET!
const apiUrl = process.env.API_URL!
const internalSecret = process.env.INTERNAL_SECRET!

server.on('upgrade', (request: IncomingMessage, socket: Socket, head: Buffer) => {
  const tokens = authorizeClient(request, socket)
  if (!tokens) return

  const {accessToken, refreshToken} = tokens
  wss.handleUpgrade(request, socket, head, ws => {
    ;(ws as AugmentedSocket).accessToken = accessToken
    ;(ws as AugmentedSocket).refreshToken = refreshToken
    wss.emit('connection', ws)
  })
})

wss.on('connection', (socket: AugmentedSocket) => {
  refreshAccessTokenLoop(socket)

  socket.on('message', (message: Buffer) => {
    wss.clients.forEach(client => {
      const msg = {text: message.toString(), userId: socket.accessToken.userId}
      client.send(JSON.stringify(msg))
    })
  })

  socket.on('close', () => {
    clearTimeout(socket.refreshLoop)
  })
})

server.listen(3000)

const tryAccessTokenFromString = (token: string) => {
  try {
    return jwt.verify(token, accessTokenSecret) as AccessToken
  } catch (e) {}
}

const authorizeClient = (request: IncomingMessage, socket: Socket) => {
  const cookies = cookie.parse(request.headers.cookie as string)
  const accessToken = tryAccessTokenFromString(cookies[Cookies.AccessToken])

  if (!accessToken) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
    socket.destroy()
    return
  }

  const refreshToken = cookies[Cookies.RefreshToken]
  return {accessToken, refreshToken}
}

const refreshAccessToken = async (socket: AugmentedSocket) => {
  const payload = {refreshToken: socket.refreshToken}
  const response = await axios.post<RefreshTokensServer>(`${apiUrl}/refresh-ssr`, payload, {
    headers: {Authorization: internalSecret},
  })
  return jwt.verify(response.data.accessToken, accessTokenSecret) as AccessToken
}

const refreshAccessTokenLoop = (socket: AugmentedSocket) => {
  const timUntilExpiration =
    new Date(socket.accessToken.exp * 1000).getTime() - new Date().getTime()

  socket.refreshLoop = setTimeout(async () => {
    try {
      socket.accessToken = await refreshAccessToken(socket)
      refreshAccessTokenLoop(socket)
    } catch (err) {
      socket.close()
    }
  }, timUntilExpiration * 0.8)
}
