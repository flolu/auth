import {UserProvider} from 'contexts/user.context'

import {Navigation} from '../components/navigation'

import type {AppProps} from 'next/app'

function MyApp({Component, pageProps}: AppProps) {
  return (
    <UserProvider>
      <Navigation />
      <Component {...pageProps} />
    </UserProvider>
  )
}
export default MyApp
