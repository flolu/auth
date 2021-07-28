import {NextFunction, Request, Response} from 'express'
import {injectable} from 'inversify'
import {BaseMiddleware} from 'inversify-express-utils'

import {ConfigService} from '../config.service'
import {AccessToken} from './access-token'
import {Cookies} from './cookies'

@injectable()
export class AuthMiddleware extends BaseMiddleware {
  constructor(private config: ConfigService) {
    super()
  }

  async handler(req: Request, res: Response, next: NextFunction) {
    try {
      const tokenString = req.cookies[Cookies.AccessToken]
      const token = AccessToken.tryFromString(
        tokenString,
        this.config.accessTokenSecret
      )
      if (!token) return next(new Error('Not Signed in'))
      res.locals.token = token
      next()
    } catch (err) {
      next(err)
    }
  }
}
