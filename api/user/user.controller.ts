import {Request} from 'express'
import {controller, httpGet, interfaces} from 'inversify-express-utils'

import {AuthMiddleware} from '../auth/auth.middleware'
import {ResponseWithToken} from '../types'
import {UserService} from './user.service'

@controller('/user')
export class UserController implements interfaces.Controller {
  constructor(private userService: UserService) {}

  @httpGet('/me', AuthMiddleware)
  async getMe(_req: Request, res: ResponseWithToken) {
    const user = await this.userService.getById(res.locals.token.userId)
    return user
  }
}
