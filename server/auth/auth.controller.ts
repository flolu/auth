import {controller, httpGet, httpPost, interfaces} from 'inversify-express-utils'

import {UserService} from '../user/user.service'
import {AuthMiddleware} from './auth.middleware'
import {AuthService} from './auth.service'
import {InternalMiddleware} from './internal.middleware'

@controller('/auth')
export class AuthController implements interfaces.Controller {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  @httpGet('/github')
  async signInWithGitHub() {}

  @httpPost('/refresh')
  async refreshTokens() {}

  @httpPost('/refresh-ssr', InternalMiddleware)
  async refreshTokensServerSide() {}

  @httpPost('/logout', AuthMiddleware)
  async logout() {}

  @httpPost('/logout-all', AuthMiddleware)
  async logoutAll() {}
}
