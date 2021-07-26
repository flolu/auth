import {injectable} from 'inversify'
import {BaseMiddleware} from 'inversify-express-utils'

@injectable()
export class InternalMiddleware extends BaseMiddleware {
  handler() {}
}
