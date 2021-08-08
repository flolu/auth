import axios from 'axios'
import {injectable} from 'inversify'

import {ConfigService} from '../config.service'

interface GitHubUser {
  id: number
  name: string
}

interface AccessTokenResponse {
  access_token: string
}

interface UserResponse {
  id: number
  name: string
}

@injectable()
export class GitHubAdapter {
  private readonly tokenURL = 'https://github.com/login/oauth/access_token'
  private readonly userURL = 'https://api.github.com/user'

  constructor(private config: ConfigService) {}

  async getUser(code: string): Promise<GitHubUser> {
    const token = await this.getAccessToken(code)
    const response = await axios.get<UserResponse>(this.userURL, {
      headers: {Authorization: `Bearer ${token}`},
    })
    return response.data as GitHubUser
  }

  private async getAccessToken(code: string) {
    const response = await axios.post<AccessTokenResponse>(
      this.tokenURL,
      {
        client_id: this.config.gitHubClientId,
        client_secret: this.config.gitHubClientSecret,
        code,
      },
      {
        headers: {Accept: 'application/json'},
      }
    )
    return response.data.access_token
  }
}
