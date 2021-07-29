import axios from 'axios'

import {Api} from './api'
import {environment} from './environment'

export class ClientApi extends Api {
  async refreshTokens() {
    try {
      await axios.post(`${environment.apiUrl}/auth/refresh`, undefined, {
        withCredentials: true,
      })
      console.log('Tokens refreshed')
    } catch (error) {
      throw this.getError(error)
    }
  }
}
