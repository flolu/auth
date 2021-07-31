import {Logout} from 'components/logout'
import {useUser} from 'contexts/user.context'
import {environment} from 'lib/environment'
import {fetcher} from 'lib/fetcher'
import {useEffect} from 'react'

import {UserDocument} from '@shared'

export default function Me() {
  const {user, setUser} = useUser()

  const getMe = async () => {
    const [error, user] = await fetcher<UserDocument>(`${environment.apiUrl}/user/me`)
    if (!error && user) setUser(user)
  }

  useEffect(() => {
    if (!user) getMe()
  }, [])

  return (
    <main>
      <h1>Me</h1>
      {user && (
        <div>
          <pre>{JSON.stringify(user, null, 2)}</pre>
          <Logout />
        </div>
      )}
    </main>
  )
}
