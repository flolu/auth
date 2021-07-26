import {injectable} from 'inversify'
import {BaseMiddleware} from 'inversify-express-utils'

@injectable()
export class AuthMiddleware extends BaseMiddleware {
  handler() {}
}
