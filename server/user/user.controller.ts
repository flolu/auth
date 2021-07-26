import {controller, httpGet, httpPost, interfaces} from 'inversify-express-utils'

import {AuthMiddleware} from '../auth/auth.middleware'
import {UserService} from './user.service'

@controller('/user')
export class UserController implements interfaces.Controller {
  constructor(private userService: UserService) {}

  @httpGet('/me', AuthMiddleware)
  async getMe() {}

  @httpPost('/rename', AuthMiddleware)
  async rename() {}
}
