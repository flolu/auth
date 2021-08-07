import axios from 'axios'
import * as cookie from 'cookie'
import {IncomingMessage} from 'http'
import * as jwt from 'jsonwebtoken'
import {Socket} from 'net'

import {AccessToken, Cookies, RefreshTokensServer} from '@shared'

import {AugmentedSocket} from './types'

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET!
const apiUrl = process.env.API_URL!
const internalSecret = process.env.INTERNAL_SECRET!

const tryAccessTokenFromString = (token: string) => {
  try {
    return jwt.verify(token, accessTokenSecret) as AccessToken
  } catch (e) {}
}

export const authorizeClient = (request: IncomingMessage, socket: Socket) => {
  const cookies = cookie.parse(request.headers.cookie as string)
  const accessToken = tryAccessTokenFromString(cookies[Cookies.AccessToken])

  if (!accessToken) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
    socket.destroy()
    return
  }

  const refreshToken = cookies[Cookies.RefreshToken]
  return {accessToken, refreshToken}
}

const refreshAccessToken = async (socket: AugmentedSocket) => {
  const payload = {refreshToken: socket.refreshToken}
  const response = await axios.post<RefreshTokensServer>(`${apiUrl}/auth/refresh-ssr`, payload, {
    headers: {Authorization: internalSecret},
  })
  return jwt.verify(response.data.accessToken, accessTokenSecret) as AccessToken
}

export const refreshAccessTokenLoop = (socket: AugmentedSocket) => {
  const timUntilExpiration =
    new Date(socket.accessToken.exp * 1000).getTime() - new Date().getTime()

  socket.refreshLoop = setTimeout(async () => {
    try {
      socket.accessToken = await refreshAccessToken(socket)
      refreshAccessTokenLoop(socket)
    } catch (err) {
      socket.close()
    }
  }, timUntilExpiration * 0.8)
}
