import {injectable} from 'inversify'

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
}
