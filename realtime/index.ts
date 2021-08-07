import * as cookie from 'cookie'
import {createServer, IncomingMessage} from 'http'
import {Socket} from 'node:net'
import * as WebSocket from 'ws'

import {AccessToken, Cookies} from '@shared'

const server = createServer()
const wss = new WebSocket.Server({noServer: true})
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET!

interface AuthenticatedRequest extends IncomingMessage {
  token: AccessToken
}

// TODO handle silent token refresh and token expiration
server.on('upgrade', (request: IncomingMessage, socket: Socket, head: Buffer) => {
  const cookies = cookie.parse(request.headers.cookie as string)
  const accessToken = AccessToken.tryFromString(cookies[Cookies.AccessToken], accessTokenSecret)

  if (!accessToken) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
    socket.destroy()
    return
  }

  ;(request as AuthenticatedRequest).token = accessToken

  wss.handleUpgrade(request, socket, head, ws => {
    wss.emit('connection', ws, request)
  })
})

wss.on('connection', (socket: WebSocket, request: AuthenticatedRequest) => {
  socket.on('message', (message: Buffer) => {
    wss.clients.forEach(client => {
      const msg = {text: message.toString(), userId: request.token.userId.toString()}
      client.send(JSON.stringify(msg))
    })
  })
})

server.listen(3000)
