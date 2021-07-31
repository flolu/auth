import {Logout} from 'components/logout'
import {useUser} from 'contexts/user.context'
import {getSSRPropsWithFetcher} from 'lib/get-props'
import Router from 'next/router'
import {FC, useEffect} from 'react'

import {UserDocument} from '@shared'

import {environment} from '../lib/environment'

interface Props {
  error: string | null
  user: UserDocument | null
}

const MeSSR: FC<Props> = props => {
  if (props.error) Router.replace('/')
  const userContext = useUser()
  const user = userContext.user || props.user

  useEffect(() => {
    userContext.setUser(props.user!)
  }, [])

  return (
    <main>
      <h1>Me SSR</h1>
      {user && (
        <div>
          <pre>{JSON.stringify(user, null, 2)}</pre>
          <Logout />
        </div>
      )}
    </main>
  )
}

export default MeSSR

export const getServerSideProps = getSSRPropsWithFetcher(async ({fetcher}) => {
  const [error, user] = await fetcher<UserDocument>(`${environment.apiUrl}/user/me`)
  return {props: {error, user}, redirect: error ? '/' : undefined}
})
