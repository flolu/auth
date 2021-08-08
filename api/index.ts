import 'reflect-metadata'

import cookieParser from 'cookie-parser'
import cors from 'cors'
import {Container} from 'inversify'
import {InversifyExpressServer} from 'inversify-express-utils'

import {authModule} from './auth'
import {ConfigService} from './config.service'
import {Database} from './database'
import {IndexController} from './index.controller'
import {userModule} from './user'

let container = new Container()

container.bind(IndexController).toSelf()
container.bind(ConfigService).toSelf()
container.bind(Database).toSelf()

container.load(authModule)
container.load(userModule)

const server = new InversifyExpressServer(container)

server.setConfig(app => {
  app.use(cors({credentials: true, origin: true}))
  app.use(cookieParser())
})

server.build().listen(3000)
