import {NextFunction, Request, Response} from 'express'
import {injectable} from 'inversify'
import {BaseMiddleware} from 'inversify-express-utils'

import {ConfigService} from '../config.service'

@injectable()
export class InternalMiddleware extends BaseMiddleware {
  constructor(private config: ConfigService) {
    super()
  }

  handler(req: Request, res: Response, next: NextFunction) {
    const secret = req.headers.authorization
    if (secret === this.config.internalSecret) return next()

    res.status(400)
    return next(new Error('Invalid internal secret'))
  }
}
