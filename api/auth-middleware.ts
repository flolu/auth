import {NextFunction, Request, Response} from 'express'

import {AccessToken, Cookies} from '@shared'

import {verifyAccessToken} from './token-utils'

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  let token: AccessToken | undefined

  token = verifyAccessToken(req.cookies[Cookies.AccessToken])
  if (!token) token = verifyAccessToken(req.headers.authorization as string)

  if (!token) {
    res.status(401)
    return next(new Error('Not Signed in'))
  }

  res.locals.token = token
  next()
}
