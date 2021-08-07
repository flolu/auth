import {Response} from 'express'

import {AccessToken} from '@shared'

export interface ResponseWithToken extends Response {
  locals: {
    token: AccessToken
  }
}
