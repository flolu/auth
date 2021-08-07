import axios, {AxiosResponse} from 'axios'

import {environment} from './environment'
import {getError} from './errors'

export type QueryResponse<T> = [error: string | null, data: T | null]

const refreshTokens = async () => {
  await axios.post(`${environment.apiUrl}/auth/refresh`, undefined, {
    withCredentials: true,
  })
}

const handleRequest = async <T>(executeRequest: () => Promise<AxiosResponse>): Promise<T> => {
  try {
    const response = await executeRequest()
    return response.data
  } catch (error) {
    if (error?.response?.status === 401) {
      try {
        await refreshTokens()
        const innerResponse = await executeRequest()
        return innerResponse.data
      } catch (innerError) {
        throw getError(innerError)
      }
    }

    throw getError(error)
  }
}

export const fetcher = async <T>(url: string): Promise<QueryResponse<T>> => {
  try {
    const data = await handleRequest<T>(() => axios.get(url, {withCredentials: true}))
    return [null, data]
  } catch (error) {
    return [error, null]
  }
}

export const poster = async <T>(url: string, payload?: unknown): Promise<QueryResponse<T>> => {
  try {
    const data = await handleRequest<T>(() => axios.post<T>(url, payload, {withCredentials: true}))
    return [null, data]
  } catch (error) {
    return [error, null]
  }
}
