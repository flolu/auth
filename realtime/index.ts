import {createServer, IncomingMessage} from 'http'
import {Socket} from 'net'
import * as WebSocket from 'ws'

import {authorizeClient, refreshAccessTokenLoop} from './authentication'
import {AugmentedSocket} from './types'

const server = createServer((_req, res) => {
  res.statusCode = 200
  res.write('Realtime')
  res.end()
})

const wss = new WebSocket.Server({noServer: true})

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
