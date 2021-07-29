import axios from 'axios'
import cookie from 'cookie'
import {IncomingMessage, ServerResponse} from 'http'

import {Cookies, TokenExpiration} from '@shared'

import {Api} from './api'
import {environment} from './environment'

export class ServerApi extends Api {
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
        Cookies.RefreshToken,
        refreshToken,
        {...this.cookieOptions, maxAge: TokenExpiration.Refresh}
      )
    }
    const accessTokenCookie = cookie.serialize(
      Cookies.AccessToken,
      accessToken,
      {...this.cookieOptions, maxAge: TokenExpiration.Access}
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
    const refresh = cookie.serialize(Cookies.RefreshToken, '', {maxAge: 0})
    const access = cookie.serialize(Cookies.AccessToken, '', {maxAge: 0})
    this.res.setHeader('Set-Cookie', `${refresh}; ${access};`)
  }

  private cookieOptions: cookie.CookieSerializeOptions = {
    httpOnly: true,
    secure: environment.isProduction,
    sameSite: environment.isProduction ? 'strict' : 'lax',
    domain: environment.baseDomain,
  }

  private getAccessToken() {
    if (this.accessToken) return this.accessToken
    if (!this.req.headers.cookie) return ''
    const cookies = cookie.parse(this.req.headers.cookie)
    return cookies[Cookies.AccessToken] || ''
  }

  private getRefreshToken() {
    if (!this.req.headers.cookie) return ''
    const cookies = cookie.parse(this.req.headers.cookie)
    return cookies[Cookies.RefreshToken] || ''
  }
}
