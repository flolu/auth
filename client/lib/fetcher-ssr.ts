import axios, {AxiosResponse} from 'axios'
import cookie from 'cookie'
import {IncomingMessage, ServerResponse} from 'http'

import {Cookies, TokenExpiration} from '@shared'

import {environment} from './environment'
import {getError} from './errors'
import {QueryResponse} from './fetcher'

const getRefreshToken = (req: IncomingMessage) => {
  if (!req.headers.cookie) return ''
  const cookies = cookie.parse(req.headers.cookie)
  return cookies[Cookies.RefreshToken] || ''
}

const cookieOptions: cookie.CookieSerializeOptions = {
  httpOnly: true,
  secure: environment.isProduction,
  sameSite: environment.isProduction ? 'strict' : 'lax',
  domain: environment.baseDomain,
  path: '/',
}

const accessTokenCookieOptions: cookie.CookieSerializeOptions = {
  ...cookieOptions,
  maxAge: TokenExpiration.Access,
}

const refreshTokenCookieOptions: cookie.CookieSerializeOptions = {
  ...cookieOptions,
  maxAge: TokenExpiration.Refresh,
}

const setCookies = (res: ServerResponse, accessToken: string, refreshToken?: string) => {
  let refreshTokenCookie = ''
  if (refreshToken) {
    refreshTokenCookie = cookie.serialize(
      Cookies.RefreshToken,
      refreshToken,
      refreshTokenCookieOptions
    )
  }
  const accessTokenCookie = cookie.serialize(
    Cookies.AccessToken,
    accessToken,
    accessTokenCookieOptions
  )

  if (refreshToken) {
    res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie])
  } else {
    res.setHeader('Set-Cookie', accessTokenCookie)
  }
}

const clearCookies = (res: ServerResponse) => {
  const refresh = cookie.serialize(Cookies.RefreshToken, '', {maxAge: 0})
  const access = cookie.serialize(Cookies.AccessToken, '', {maxAge: 0})
  res.setHeader('Set-Cookie', [refresh, access])
}

const refreshTokens = async (req: IncomingMessage, res: ServerResponse) => {
  const currentRefreshToken = getRefreshToken(req)
  if (!currentRefreshToken) throw 'No refresh token'

  try {
    const payload = {refreshToken: currentRefreshToken}
    const response = await axios.post<{accessToken: string; refreshToken?: string}>(
      `${environment.apiUrl}/auth/refresh-ssr`,
      payload,
      {
        headers: {Authorization: environment.internalSecret},
        withCredentials: true,
      }
    )
    const {accessToken, refreshToken} = response.data
    setCookies(res, accessToken, refreshToken)
    return {accessToken}
  } catch (err) {
    if (err === 'Token revoked') {
      clearCookies(res)
    }
    throw err
  }
}

const getAccessToken = (req: IncomingMessage) => {
  if (!req.headers.cookie) return undefined
  const cookies = cookie.parse(req.headers.cookie)
  return cookies[Cookies.AccessToken] || undefined
}

const handleRequest = async (
  req: IncomingMessage,
  res: ServerResponse,
  executeRequest: (accessToken: string) => Promise<AxiosResponse>
) => {
  const currentAccessToken = getAccessToken(req)
  if (currentAccessToken) {
    try {
      const response = await executeRequest(currentAccessToken)
      return response.data
    } catch (error) {
      if (error?.response?.status === 401) {
        try {
          const {accessToken} = await refreshTokens(req, res)
          const innerResponse = await executeRequest(accessToken)
          return innerResponse.data
        } catch (innerError) {
          throw getError(innerError)
        }
      }
      throw getError(error)
    }
  } else {
    try {
      const {accessToken} = await refreshTokens(req, res)
      const response = await executeRequest(accessToken)
      return response.data
    } catch (error) {
      throw getError(error)
    }
  }
}

export const fetcherSSR = async <T>(
  req: IncomingMessage,
  res: ServerResponse,
  url: string
): Promise<QueryResponse<T>> => {
  try {
    const data = await handleRequest(req, res, (accessToken: string) =>
      axios.get(url, {
        headers: {Authorization: accessToken},
        withCredentials: true,
      })
    )
    return [null, data]
  } catch (error) {
    return [error, null]
  }
}
