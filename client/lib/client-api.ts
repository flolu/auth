import axios from 'axios'

import {Api} from './api'
import {environment} from './environment'

export class ClientApi extends Api {
  buildHeaders() {
    return {}
  }

  async refreshTokens() {
    try {
      await axios.post(`${environment.apiUrl}/auth/refresh`, undefined, {
        withCredentials: true,
      })
    } catch (error) {
      throw this.getError(error)
    }
  }
}
