import {NextFunction, Request, Response} from 'express'
import {injectable} from 'inversify'
import {BaseMiddleware} from 'inversify-express-utils'
import jwt from 'jsonwebtoken'
import {ResponseWithToken} from 'server/types'

import {AccessToken, Cookies} from '@shared'

import {ConfigService} from '../config.service'

@injectable()
export class AuthMiddleware extends BaseMiddleware {
  constructor(private config: ConfigService) {
    super()
  }

  async handler(req: Request, res: Response, next: NextFunction) {
    let token: AccessToken | undefined

    token = this.tryFromString(req.cookies[Cookies.AccessToken])
    if (!token) token = this.tryFromString(req.headers.authorization as string)

    if (!token) {
      res.status(401)
      return next(new Error('Not Signed in'))
    }

    ;(res as unknown as ResponseWithToken).locals.token = token
    next()
  }

  private tryFromString(accessTokenString: string) {
    try {
      return jwt.verify(accessTokenString, this.config.accessTokenSecret) as AccessToken
    } catch (e) {}
  }
}
