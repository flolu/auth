import {Logout} from 'components/logout'
import {useUser} from 'contexts/user.context'
import {withUser} from 'lib/get-props'
import Router from 'next/router'
import {FC} from 'react'

import {UserDocument} from '@shared'

interface Props {
  error: string | null
  user: UserDocument | null
}

const MeSSR: FC<Props> = props => {
  if (props.error) Router.replace('/')
  const {user} = useUser()

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

export const getServerSideProps = withUser()
