import {ContainerModule} from 'inversify'

import {AuthController} from './auth.controller'
import {AuthMiddleware} from './auth.middleware'
import {AuthService} from './auth.service'
import {GitHubAdapter} from './github.adapter'
import {InternalMiddleware} from './internal.middleware'

export const authModule = new ContainerModule((bind) => {
  bind(AuthController).toSelf()
  bind(AuthService).toSelf()
  bind(AuthMiddleware).toSelf()
  bind(InternalMiddleware).toSelf()
  bind(GitHubAdapter).toSelf()
})
