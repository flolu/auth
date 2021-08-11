import axios, {AxiosResponse} from 'axios'

import {environment} from './environment'
import {getError} from './errors'

export type QueryResponse<T> = [error: string | null, data: T | null]

export const refreshTokens = async () => {
  await axios.post(`${environment.apiUrl}/refresh`, undefined, {withCredentials: true})
}

const handleRequest = async (request: () => Promise<AxiosResponse>): Promise<AxiosResponse> => {
  try {
    return await request()
  } catch (error) {
    if (error?.response?.status === 401) {
      try {
        await refreshTokens()
        return await request()
      } catch (innerError) {
        throw getError(innerError)
      }
    }

    throw getError(error)
  }
}

export const fetcher = async <T>(url: string): Promise<QueryResponse<T>> => {
  try {
    const request = () => axios.get(url, {withCredentials: true})
    const {data} = await handleRequest(request)
    return [null, data]
  } catch (error) {
    return [error, null]
  }
}

export const poster = async <T>(url: string, payload?: unknown): Promise<QueryResponse<T>> => {
  try {
    const request = () => axios.post(url, payload, {withCredentials: true})
    const {data} = await handleRequest(request)
    return [null, data]
  } catch (error) {
    return [error, null]
  }
}
