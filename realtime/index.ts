import axios from 'axios'
import * as cookie from 'cookie'
import {createServer, IncomingMessage} from 'http'
import * as jwt from 'jsonwebtoken'
import {Socket} from 'node:net'
import * as WebSocket from 'ws'

import {AccessToken, Cookies, RefreshTokensServer} from '@shared'

const server = createServer()
const wss = new WebSocket.Server({noServer: true})
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET!
const apiUrl = process.env.API_URL!
const internalSecret = process.env.INTERNAL_SECRET!

interface AugmentedSocket extends WebSocket {
  accessToken: AccessToken
  refreshToken: string
  refreshLoop: NodeJS.Timeout
}

const tryAccessTokenFromString = (token: string) => {
  try {
    return jwt.verify(token, accessTokenSecret) as AccessToken
  } catch (e) {}
}

server.on('upgrade', (request: IncomingMessage, socket: Socket, head: Buffer) => {
  const cookies = cookie.parse(request.headers.cookie as string)
  const accessToken = tryAccessTokenFromString(cookies[Cookies.AccessToken])

  if (!accessToken) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
    socket.destroy()
    return
  }

  const refreshToken = cookies[Cookies.RefreshToken]

  wss.handleUpgrade(request, socket, head, ws => {
    ;(ws as AugmentedSocket).accessToken = accessToken
    ;(ws as AugmentedSocket).refreshToken = refreshToken
    wss.emit('connection', ws)
  })
})

// TODO refresh instantly if access token expires 'soon'
const refreshAccessTokenLoop = (socket: AugmentedSocket) => {
  const timUntilExpiration =
    new Date(socket.accessToken.exp * 1000).getTime() - new Date().getTime()
  console.log({timUntilExpiration})

  socket.refreshLoop = setTimeout(async () => {
    try {
      socket.accessToken = await refreshAccessToken(socket)
    } catch (err) {
      socket.close()
    }
    refreshAccessTokenLoop(socket)
  }, timUntilExpiration * 0.8)
}

const refreshAccessToken = async (socket: AugmentedSocket) => {
  const payload = {refreshToken: socket.refreshToken}
  const response = await axios.post<RefreshTokensServer>(`${apiUrl}/auth/refresh-ssr`, payload, {
    headers: {Authorization: internalSecret},
  })
  return jwt.verify(response.data.accessToken, accessTokenSecret) as AccessToken
}

wss.on('connection', (socket: AugmentedSocket) => {
  refreshAccessTokenLoop(socket)

  socket.on('message', (message: Buffer) => {
    wss.clients.forEach(client => {
      const msg = {text: message.toString(), userId: socket.accessToken.userId.toString()}
      client.send(JSON.stringify(msg))
    })
  })

  socket.on('close', () => {
    clearTimeout(socket.refreshLoop)
  })
})

server.listen(3000)
