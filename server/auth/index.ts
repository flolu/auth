import {ContainerModule} from 'inversify'

import {AuthController} from './auth.controller'

export const authModule = new ContainerModule((bind) => {
  bind(AuthController).toSelf().inSingletonScope()
})
