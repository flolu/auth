import {CookieOptions, Response} from 'express'
import jwt from 'jsonwebtoken'

import {
  AccessToken,
  AccessTokenPayload,
  Cookies,
  RefreshToken,
  RefreshTokenPayload,
  UserDocument,
} from '@shared'

import {config} from './config'

enum TokenExpiration {
  Access = 5 * 60,
  Refresh = 7 * 24 * 60 * 60,
  RefreshIfLessThan = 4 * 24 * 60 * 60,
}

function signAccessToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, config.accessTokenSecret, {expiresIn: TokenExpiration.Access})
}

function signRefreshToken(payload: RefreshTokenPayload) {
  return jwt.sign(payload, config.refreshTokenSecret, {expiresIn: TokenExpiration.Refresh})
}

const defaultCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: config.isProduction,
  sameSite: config.isProduction ? 'strict' : 'lax',
  domain: config.baseDomain,
  path: '/',
}

const cookieOptions = {
  refresh: {
    ...defaultCookieOptions,
    maxAge: TokenExpiration.Refresh * 1000,
  },
  access: {
    ...defaultCookieOptions,
    maxAge: TokenExpiration.Access * 1000,
  },
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, config.refreshTokenSecret) as RefreshToken
}

export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, config.accessTokenSecret) as AccessToken
  } catch (e) {}
}

export function buildTokens(user: UserDocument) {
  const accessPayload: AccessTokenPayload = {userId: user.id}
  const refreshPayload: RefreshTokenPayload = {userId: user.id, version: user.tokenVersion}

  const accessToken = signAccessToken(accessPayload)
  const refreshToken = refreshPayload && signRefreshToken(refreshPayload)

  return {accessToken, refreshToken}
}

export function setTokens(res: Response, access: string, refresh?: string) {
  res.cookie(Cookies.AccessToken, access, cookieOptions.access)
  if (refresh) res.cookie(Cookies.RefreshToken, refresh, cookieOptions.refresh)
}

export function refreshTokens(current: RefreshToken, tokenVersion: number) {
  if (tokenVersion !== current.version) throw 'Token revoked'
  const accessPayload: AccessTokenPayload = {userId: current.userId}
  let refreshPayload: RefreshTokenPayload | undefined

  const secondsUntilExpiration =
    (new Date(current.exp * 1000).getTime() - new Date().getTime()) / 1000
  if (secondsUntilExpiration < TokenExpiration.RefreshIfLessThan) {
    refreshPayload = {userId: current.userId, version: tokenVersion}
  }

  const accessToken = signAccessToken(accessPayload)
  const refreshToken = refreshPayload && signRefreshToken(refreshPayload)

  return {accessToken, refreshToken}
}

export function clearTokens(res: Response) {
  res.clearCookie(Cookies.AccessToken)
  res.clearCookie(Cookies.RefreshToken)
}
