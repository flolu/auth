import 'reflect-metadata'

import bodyParser from 'body-parser'
import {Container} from 'inversify'
import {InversifyExpressServer} from 'inversify-express-utils'

import {authModule} from './auth'
import {ConfigService} from './config.service'
import {Database} from './database'
import {IndexController} from './index.controller'
import {userModule} from './user'

let container = new Container()

container.bind(IndexController).toSelf().inSingletonScope()
container.bind(ConfigService).toSelf().inSingletonScope()
container.bind(Database).toSelf().inSingletonScope()

container.load(authModule)
container.load(userModule)

let server = new InversifyExpressServer(container)

server.setConfig((app) => {
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(bodyParser.json())
})

const app = server.build()
app.listen(3000, () => console.log('Server started'))
