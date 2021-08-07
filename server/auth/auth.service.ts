import {injectable} from 'inversify'

import {
  AccessTokenPayload,
  RefreshToken,
  RefreshTokenPayload,
  TokenExpiration,
  UserDocument,
} from '@shared'

@injectable()
export class AuthService {
  createTokens(user: UserDocument) {
    const accessToken: AccessTokenPayload = {userId: user.id}
    const refreshToken: RefreshTokenPayload = {userId: user.id, version: user.tokenVersion}
    return {accessToken, refreshToken}
  }

  refreshTokens(current: RefreshToken, tokenVersion: number) {
    if (tokenVersion !== current.version) throw 'Token revoked'
    const accessToken: AccessTokenPayload = {userId: current.userId}

    let refreshToken: RefreshTokenPayload | undefined

    const secondsUntilExpiration =
      (new Date(current.exp * 1000).getTime() - new Date().getTime()) / 1000
    if (secondsUntilExpiration < TokenExpiration.RefreshIfLessThan) {
      refreshToken = {userId: current.userId, version: current.version}
    }

    return {accessToken, refreshToken}
  }
}
