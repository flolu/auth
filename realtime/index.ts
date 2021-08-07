import {IncomingMessage} from 'http'
import * as WebSocket from 'ws'

const server = new WebSocket.Server({port: 3000})

server.on('connection', (socket: WebSocket, request: IncomingMessage) => {
  socket.send('Hi from server')

  socket.on('message', (message: any) => {
    console.log(message.toString())
  })
})
