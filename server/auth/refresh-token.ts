import {Token} from './token'
import {TokenExpiration} from './token-expiration'

interface RefreshTokenPayload {
  userId: string
  version: number
}

export class RefreshToken extends Token<RefreshTokenPayload> {
  constructor(public readonly userId: string, public readonly version: number) {
    super(TokenExpiration.Refresh)
  }

  static fromString(token: string, secret: string) {
    const decoded = Token.decode<RefreshTokenPayload>(token, secret)
    return new RefreshToken(decoded.userId, decoded.version)
  }

  protected get serializedPayload() {
    return {
      userId: this.userId,
      version: this.version,
    }
  }
}
