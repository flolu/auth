import {NextFunction, Request, Response} from 'express'
import {injectable} from 'inversify'
import {BaseMiddleware} from 'inversify-express-utils'

import {AccessToken, Cookies} from '@shared'

import {ConfigService} from '../config.service'

@injectable()
export class AuthMiddleware extends BaseMiddleware {
  constructor(private config: ConfigService) {
    super()
  }

  async handler(req: Request, res: Response, next: NextFunction) {
    let token: AccessToken | undefined

    if (req.cookies[Cookies.AccessToken]) {
      token = AccessToken.tryFromString(
        req.cookies[Cookies.AccessToken],
        this.config.accessTokenSecret
      )
    }

    if (!token && req.headers.authorization) {
      token = AccessToken.tryFromString(
        req.headers.authorization.toString(),
        this.config.accessTokenSecret
      )
    }

    if (!token) {
      res.status(401)
      return next(new Error('Not Signed in'))
    }

    res.locals.token = token
    next()
  }
}
