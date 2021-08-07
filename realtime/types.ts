import * as WebSocket from 'ws'

import {AccessToken} from '@shared'

export interface AugmentedSocket extends WebSocket {
  accessToken: AccessToken
  refreshToken: string
  refreshLoop: NodeJS.Timeout
}
