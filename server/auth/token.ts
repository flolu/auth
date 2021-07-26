import jwt from 'jsonwebtoken'

export abstract class Token<T> {
  protected constructor(private expiresInSeconds: number) {}

  static decode<T>(token: string, secret: string) {
    try {
      return jwt.verify(token, secret) as unknown as T
    } catch (error) {
      if (error.message === 'jwt expired') throw 'Token expired'
      if (error.message === 'invalid signature') throw 'Invalid token secret'
      throw 'Invalid token'
    }
  }

  sign(secret: string, expiresInSeconds = this.expiresInSeconds) {
    return jwt.sign(Object(this.serializedPayload), secret, {
      expiresIn: expiresInSeconds,
    })
  }

  protected abstract serializedPayload: T
}
