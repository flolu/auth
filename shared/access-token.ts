export interface AccessTokenPayload {
  userId: string
}

export interface AccessToken extends AccessTokenPayload {
  exp: number
}
