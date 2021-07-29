import 'reflect-metadata'

import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import {NextFunction, Request, Response} from 'express'
import {Container} from 'inversify'
import {InversifyExpressServer} from 'inversify-express-utils'

import {authModule} from './auth'
import {ConfigService} from './config.service'
import {corsMiddleware} from './cors.middleware'
import {Database} from './database'
import {IndexController} from './index.controller'
import {userModule} from './user'

let container = new Container()

container.bind(IndexController).toSelf().inSingletonScope()
container.bind(ConfigService).toSelf().inSingletonScope()
container.bind(Database).toSelf().inSingletonScope()

container.load(authModule)
container.load(userModule)

const server = new InversifyExpressServer(container)
const config = container.get(ConfigService)

server.setConfig(app => {
  app.use(corsMiddleware(config.isProduction, config.clientUrl))
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(bodyParser.json())
  app.use(cookieParser())
})

server.setErrorConfig(app => {
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err)
    res.send(err.message)
  })
})

server.build().listen(3000)
