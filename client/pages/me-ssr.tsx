import {GetServerSideProps} from 'next'
import {FC} from 'react'

import {environment} from '../lib/environment'
import {ServerApi} from '../lib/server-api'

interface Props {
  error: string | null
  user: unknown
}

const MeSSR: FC<Props> = ({error, user}) => {
  return (
    <main>
      <h1>Me SSR</h1>
      {user && <pre>{JSON.stringify(user, null, 2)}</pre>}
      {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
    </main>
  )
}

export default MeSSR

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const api = new ServerApi(context.req, context.res)
  const [error, user] = await api.get(`${environment.apiUrl}/user/me`)
  return {props: {error, user}}
}
