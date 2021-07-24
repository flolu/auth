import express from 'express'
import http from 'http'

const app = express()
const server = new http.Server(app)
server.listen(3000, () => console.log('server running'))

app.get('**', (_req, res) => res.send('Hello world'))
