import 'reflect-metadata'

import bodyParser from 'body-parser'
import {Container} from 'inversify'
import {InversifyExpressServer} from 'inversify-express-utils'

import {authModule} from './auth'

let container = new Container()
container.load(authModule)

let server = new InversifyExpressServer(container)

server.setConfig((app) => {
  app.use(bodyParser.json())
})

const app = server.build()
app.listen(3000, () => console.log('Server started'))
