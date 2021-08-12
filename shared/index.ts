export enum Cookies {
  AccessToken = 'access',
  RefreshToken = 'refresh',
}

export interface UserDocument {
  id: string
  name: string
  tokenVersion: number
  gitHubUserId: string
}

export interface AccessTokenPayload {
  userId: string
}

export interface AccessToken extends AccessTokenPayload {
  exp: number
}

export interface RefreshTokenPayload {
  userId: string
  version: number
}

export interface RefreshToken extends RefreshTokenPayload {
  exp: number
}
