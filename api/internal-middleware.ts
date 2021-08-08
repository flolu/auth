import {NextFunction, Request, Response} from 'express'

import {config} from './config'

export function internalMiddleware(req: Request, res: Response, next: NextFunction) {
  const secret = req.headers.authorization
  if (secret === config.internalSecret) return next()

  res.status(400)
  return next(new Error('Invalid internal secret'))
}
