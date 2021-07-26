import {ContainerModule} from 'inversify'

import {UserController} from './user.controller'
import {UserService} from './user.service'

export const userModule = new ContainerModule((bind) => {
  bind(UserController).toSelf()
  bind(UserService).toSelf()
})
