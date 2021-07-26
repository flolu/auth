import {injectable} from 'inversify'

import {UserDocument} from './user.schema'

@injectable()
export class UserService {
  async create(name: string): Promise<UserDocument> {
    // TODO insert new user into database
    throw 'Not implemented'
  }
}
