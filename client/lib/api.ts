import axios, {AxiosError, AxiosResponse} from 'axios'

export type PostResponse<T> = [error: string | null, data: T | null]

export abstract class Api {
  abstract refreshTokens(): Promise<void>

  async get<T>(url: string): Promise<PostResponse<T>> {
    try {
      const executeRequest = () => axios.get(url, {withCredentials: true})

      const response = await this.handleRequestWithRefresh(executeRequest)
      return [null, response.data]
    } catch (error) {
      return [error, null]
    }
  }

  async post<T>(
    url: string,
    payload: unknown = undefined,
    headers: any = {}
  ): Promise<PostResponse<T>> {
    try {
      const executeRequest = () =>
        axios.post(url, payload, {withCredentials: true, headers})
      const response = await this.handleRequestWithRefresh(executeRequest)
      return [null, response.data]
    } catch (error) {
      return [error, null]
    }
  }

  private async handleRequestWithRefresh(
    executeRequest: () => Promise<AxiosResponse>
  ) {
    try {
      return await executeRequest()
    } catch (error) {
      if (error.response.status === 401) {
        try {
          await this.refreshTokens()
          return await executeRequest()
        } catch (innerError) {
          throw this.getError(innerError)
        }
      }

      throw this.getError(error)
    }
  }

  protected getError(error: AxiosError) {
    if (error.isAxiosError && error.response) {
      return error.response.data
    }

    return 'Unexpected error'
  }
}
