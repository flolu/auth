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

  private accessToken: string | undefined

  constructor(
    private readonly req: IncomingMessage,
    private readonly res: ServerResponse
  ) {
    super()
  }

  buildHeaders() {
    return {Authorization: this.getAccessToken()}
  }

  async refreshTokens() {
    const currentRefreshToken = this.getRefreshToken()
    if (!currentRefreshToken) throw 'No refresh token'

    try {
      const payload = {refreshToken: currentRefreshToken}
      const response = await axios.post<any>(
        `${environment.apiUrl}/auth/refresh-ssr`,
        payload,
        {
          headers: {Authorization: environment.internalSecret},
          withCredentials: true,
        }
      )
      const {accessToken, refreshToken} = response.data
      this.setCookies(accessToken, refreshToken)
      this.accessToken = accessToken
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
    domain: environment.baseDomain,
    path: '/',
  }

  private getAccessToken() {
    if (this.accessToken) return this.accessToken
    if (!this.req.headers.cookie) return ''
    const cookies = cookie.parse(this.req.headers.cookie)
    return cookies[this.accessTokenCookie] || ''
  }

  private getRefreshToken() {
    if (!this.req.headers.cookie) return ''
    const cookies = cookie.parse(this.req.headers.cookie)
    return cookies[this.refreshTokenCookie] || ''
  }
}
