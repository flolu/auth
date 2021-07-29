import type {AppProps} from 'next/app'
import {ApiProvider} from '../contexts/api.context'

function MyApp({Component, pageProps}: AppProps) {
  return (
    <ApiProvider>
      <Component {...pageProps} />
    </ApiProvider>
  )
}
export default MyApp
