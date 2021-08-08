import axios from 'axios'

import {config} from './config'

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

const tokenURL = 'https://github.com/login/oauth/access_token'
const userURL = 'https://api.github.com/user'

export async function getGitHubUser(code: string) {
  const token = await getAccessToken(code)
  const response = await axios.get<UserResponse>(userURL, {
    headers: {Authorization: `Bearer ${token}`},
  })
  return response.data as GitHubUser
}

async function getAccessToken(code: string) {
  const response = await axios.post<AccessTokenResponse>(
    tokenURL,
    {
      client_id: config.gitHubClientId,
      client_secret: config.gitHubClientSecret,
      code,
    },
    {
      headers: {Accept: 'application/json'},
    }
  )
  return response.data.access_token
}
