import {controller, httpGet, interfaces} from 'inversify-express-utils'

@controller('/')
export class IndexController implements interfaces.Controller {
  @httpGet('')
  index() {
    return 'Server running'
  }
}
