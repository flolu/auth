import {NextFunction, Request, Response} from 'express'
import {injectable} from 'inversify'
import {BaseMiddleware} from 'inversify-express-utils'

import {ConfigService} from '../config.service'
import {AccessToken} from './access-token'

@injectable()
export class AuthMiddleware extends BaseMiddleware {
  constructor(private config: ConfigService) {
    super()
  }

  async handler(req: Request, res: Response, next: NextFunction) {
    try {
      const header = req.headers.authorization
      const tokenString = header ? header.split(' ')[1] : ''
      if (!tokenString) return next(new Error('Not Signed in'))
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
