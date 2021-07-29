import axios from 'axios'
import cookie from 'cookie'
import {IncomingMessage, ServerResponse} from 'http'

import {Api} from './api'
import {environment} from './environment'

export class ServerApi extends Api {
  // FIXME consider sharing this code with backend
  private readonly accessTokenCookie = 'access'
  private readonly refreshTokenCookie = 'refresh'
  private readonly accessTokenExpiration = 5 * 60 // 5 minutes
  private readonly refreshTokenExpiration = 7 * 24 * 60 * 60 // 7 days

  private constructor(
    private readonly req: IncomingMessage,
    private readonly res: ServerResponse
  ) {
    super()
  }

  async refreshTokens() {
    const cookieHeader = this.req.headers.cookie
    const currentRefreshToken =
      cookieHeader && cookie.parse(cookieHeader)[this.refreshTokenCookie]
    if (!currentRefreshToken) throw 'No refresh token'

    try {
      const payload = {refreshToken: currentRefreshToken}
      // TODO send secret to verify that request comes from ssr client
      const [error, data] = await this.post<any>(
        `${environment.apiUrl}/auth/refresh-ssr`,
        payload
      )
      if (error || !data) throw error
      const {accessToken, refreshToken} = data
      this.setCookies(accessToken, refreshToken)
    } catch (err) {
      if (err === 'Token revoked') {
        this.clearCookies()
      }
      throw err
    }
  }

  private setCookies(accessToken: string, refreshToken?: string) {
    let refreshTokenCookie: string | undefined
    if (refreshToken) {
      refreshTokenCookie = cookie.serialize(
        this.refreshTokenCookie,
        refreshToken,
        {...this.cookieOptions, maxAge: this.refreshTokenExpiration}
      )
    }
    const accessTokenCookie = cookie.serialize(
      this.accessTokenCookie,
      accessToken,
      {...this.cookieOptions, maxAge: this.accessTokenExpiration}
    )

    if (refreshToken) {
      this.res.setHeader(
        'Set-Cookie',
        // TODO check if this works properly
        `${refreshTokenCookie}; ${accessTokenCookie};`
      )
    } else {
      this.res.setHeader('Set-Cookie', accessTokenCookie)
    }
  }

  private clearCookies() {
    const refreshTokenCookie = cookie.serialize(this.refreshTokenCookie, '', {
      ...this.cookieOptions,
      maxAge: 0,
    })
    const accessTokenCookie = cookie.serialize(this.refreshTokenCookie, '', {
      ...this.cookieOptions,
      maxAge: 0,
    })
    this.res.setHeader(
      'Set-Cookie',
      `${refreshTokenCookie}; ${accessTokenCookie};`
    )
  }

  private cookieOptions: cookie.CookieSerializeOptions = {
    httpOnly: true,
    secure: environment.isProduction,
    sameSite: environment.isProduction ? 'strict' : 'lax',
    domain: process.env.BASE_DOMAIN,
    path: '/',
  }
}
