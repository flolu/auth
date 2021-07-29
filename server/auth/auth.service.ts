import {injectable} from 'inversify'

import {TokenExpiration} from '@shared'

import {UserDocument} from '../user/user.schema'
import {AccessToken} from './access-token'
import {RefreshToken} from './refresh-token'

@injectable()
export class AuthService {
  createTokens(user: UserDocument) {
    const accessToken = new AccessToken(user.id)
    const refreshToken = new RefreshToken(user.id, user.tokenVersion)
    return {accessToken, refreshToken}
  }

  refreshTokens(current: RefreshToken, tokenVersion: number) {
    if (tokenVersion !== current.version) throw 'Token revoked'
    const accessToken = new AccessToken(current.userId)

    let refreshToken: RefreshToken | undefined
    if (current.secondsUntilExpiration < TokenExpiration.RefreshIfLessThan) {
      refreshToken = new RefreshToken(current.userId, current.version)
    }

    return {accessToken, refreshToken}
  }
}
