import {useUser} from 'contexts/user.context'
import {environment} from 'lib/environment'
import {poster} from 'lib/fetcher'
import Router from 'next/router'
import {FC} from 'react'

export const Logout: FC = () => {
  const {user, setUser} = useUser()

  const onLogout = async () => {
    await poster(`${environment.apiUrl}/auth/logout`)
    setUser(undefined)
    Router.replace('/')
  }

  const onLogoutAll = async () => {
    await poster(`${environment.apiUrl}/auth/logout-all`)
    setUser(undefined)
    Router.replace('/')
  }

  return (
    <>
      {user && (
        <div>
          <p>You are signed in as {user.name}</p>
          <button onClick={onLogout}>Logout</button>
          <button onClick={onLogoutAll}>Logout All</button>
        </div>
      )}
    </>
  )
}
