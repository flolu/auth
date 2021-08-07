import {TokenExpiration} from '@shared'

import {Token} from './token'

interface AccessTokenPayload {
  userId: string
}

export class AccessToken extends Token<AccessTokenPayload> {
  constructor(public readonly userId: string) {
    super(TokenExpiration.Access)
  }

  static fromString(token: string, secret: string) {
    const decoded = Token.decode<AccessTokenPayload>(token, secret)
    return new AccessToken(decoded.userId)
  }

  static tryFromString(token: string, secret: string) {
    try {
      return AccessToken.fromString(token, secret)
    } catch (e) {}
  }

  protected get serializedPayload() {
    return {
      userId: this.userId,
    }
  }
}
