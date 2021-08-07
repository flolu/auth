export interface RefreshTokenPayload {
  userId: string
  version: number
}

export interface RefreshToken extends RefreshTokenPayload {
  exp: number
}
