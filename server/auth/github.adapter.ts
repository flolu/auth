import {injectable} from 'inversify'

import {GitHubUser} from './auth.schema'

@injectable()
export class GitHubAdapter {
  async getUser(code: string): Promise<GitHubUser> {
    // TODO implement github sign in
    throw 'Not implemented'
  }
}
