import {controller, interfaces} from 'inversify-express-utils'

@controller('/auth')
export class AuthController implements interfaces.Controller {}
