import {Token} from './token'
import {TokenExpiration} from './token-expiration'

interface RefreshTokenPayload {
  userId: string
  version: number
  exp?: number
}

export class RefreshToken extends Token<RefreshTokenPayload> {
  constructor(
    public readonly userId: string,
    public readonly version: number,
    private expiresAt: number = -1
  ) {
    super(TokenExpiration.Refresh)
  }

  static fromString(token: string, secret: string) {
    const decoded = Token.decode<RefreshTokenPayload>(token, secret)
    return new RefreshToken(decoded.userId, decoded.version, decoded.exp)
  }

  get secondsUntilExpiration() {
    if (this.expiresAt === -1) return Infinity
    const expiration = new Date(this.expiresAt)
    const now = new Date()
    return (now.getTime() - expiration.getTime()) / 1000
  }

  protected get serializedPayload() {
    return {
      userId: this.userId,
      version: this.version,
    }
  }
}
