import {AccessToken} from './auth/access-token'

export interface ResponseWithToken extends Response {
  locals: {
    token: AccessToken
  }
}
