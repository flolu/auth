import {GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult} from 'next'

import {QueryResponse} from './fetcher'
import {fetcherSSR} from './fetcher-ssr'

export interface GetPropsParams {
  context: GetServerSidePropsContext
  fetcher: <T>(url: string) => Promise<QueryResponse<T>>
}

export const getSSRPropsWithFetcher = <T>(
  getProps: (params: GetPropsParams) => Promise<GetServerSidePropsResult<T>>
) => {
  const getServerSideProps: GetServerSideProps<T> = async context => {
    const fetcher = <T>(url: string) => fetcherSSR<T>(context.req, context.res, url)
    const props = await getProps({context, fetcher})
    return props
  }

  return getServerSideProps
}
