import {CookieOptions, Request, Response} from 'express'
import {controller, httpGet, httpPost, interfaces} from 'inversify-express-utils'

import {ConfigService} from '../config.service'
import {UserService} from '../user/user.service'
import {AccessToken} from './access-token'
import {AuthMiddleware} from './auth.middleware'
import {AuthService} from './auth.service'
import {Cookies} from './cookies'
import {GitHubAdapter} from './github.adapter'
import {InternalMiddleware} from './internal.middleware'
import {RefreshToken} from './refresh-token'
import {TokenExpiration} from './token-expiration'

@controller('/auth')
export class AuthController implements interfaces.Controller {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private gitHubAdapter: GitHubAdapter,
    private config: ConfigService
  ) {}

  @httpGet('/github')
  async signInWithGitHub(req: Request, res: Response) {
    const {code, path} = req.query

    const gitHubUser = await this.gitHubAdapter.getUser(code as string)

    let user = await this.userService.getByGitHubUserId(gitHubUser.id)
    if (!user) {
      user = await this.userService.create(gitHubUser.name, gitHubUser.id)
    }

    const {accessToken, refreshToken} = this.authService.createTokens(user)
    this.setTokens(res, accessToken, refreshToken)

    res.cookie(
      Cookies.AccessToken,
      accessToken.sign(this.config.accessTokenSecret),
      {
        ...this.cookieOptions,
        maxAge: TokenExpiration.Access * 1000,
      }
    )
    res.cookie(
      Cookies.RefreshToken,
      refreshToken.sign(this.config.refreshTokenSecret),
      {...this.cookieOptions, maxAge: TokenExpiration.Refresh * 1000}
    )

    res.redirect(`${this.config.clientUrl}${path}`)
  }

  @httpPost('/refresh')
  async refreshTokens(req: Request, res: Response) {
    const cookieToken = req.cookies[Cookies.RefreshToken]
    const current = RefreshToken.fromString(
      cookieToken,
      this.config.refreshTokenSecret
    )

    const user = await this.userService.getById(current.userId)
    if (!user) throw 'User not found'

    const tokens = this.authService.refreshTokens(current, user.tokenVersion)
    const {accessToken, refreshToken} = tokens
    this.setTokens(res, accessToken, refreshToken)
  }

  @httpPost('/refresh-ssr', InternalMiddleware)
  async refreshTokensServerSide() {}

  @httpPost('/logout', AuthMiddleware)
  async logout() {}

  @httpPost('/logout-all', AuthMiddleware)
  async logoutAll() {}

  private readonly cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: this.config.isProduction,
    sameSite: this.config.isProduction ? 'strict' : 'lax',
    domain: this.config.baseDomain,
  }

  private setTokens(
    res: Response,
    access: AccessToken,
    refresh?: RefreshToken
  ) {
    res.cookie(
      Cookies.AccessToken,
      access.sign(this.config.accessTokenSecret),
      {
        ...this.cookieOptions,
        maxAge: TokenExpiration.Access * 1000,
      }
    )

    if (refresh) {
      res.cookie(
        Cookies.RefreshToken,
        refresh.sign(this.config.refreshTokenSecret),
        {
          ...this.cookieOptions,
          maxAge: TokenExpiration.Refresh * 1000,
        }
      )
    }
  }
}
