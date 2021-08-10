import axios, {AxiosResponse} from 'axios'
import {IncomingMessage, ServerResponse} from 'http'

import {RefreshTokensServer} from '@shared'

import {environment} from './environment'
import {getError} from './errors'
import {QueryResponse} from './fetcher'

const SET_COOKIE_HEADER = 'set-cookie'

const refreshTokens = async (req: IncomingMessage, res: ServerResponse) => {
  const response = await axios.post<RefreshTokensServer>(
    `${environment.apiUrl}/refresh`,
    undefined,
    {headers: {cookie: req.headers.cookie}}
  )
  const cookies = response.headers[SET_COOKIE_HEADER]

  req.headers.cookie = cookies
  res.setHeader(SET_COOKIE_HEADER, cookies)
}

const handleRequest = async (
  req: IncomingMessage,
  res: ServerResponse,
  executeRequest: () => Promise<AxiosResponse>
) => {
  try {
    return await executeRequest()
  } catch (error) {
    if (error?.response?.status === 401) {
      try {
        await refreshTokens(req, res)
        return await executeRequest()
      } catch (innerError) {
        throw getError(innerError)
      }
    }
    throw getError(error)
  }
}

export const fetcherSSR = async <T>(
  req: IncomingMessage,
  res: ServerResponse,
  url: string
): Promise<QueryResponse<T>> => {
  try {
    const {data} = await handleRequest(req, res, () => {
      return axios.get(url, {headers: {cookie: req.headers.cookie}})
    })
    return [null, data]
  } catch (error) {
    return [error, null]
  }
}
