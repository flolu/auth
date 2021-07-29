import Router from 'next/router'
import {useEffect, useState} from 'react'

import {useApi} from '../contexts/api.context'
import {environment} from '../lib/environment'

export default function Me() {
  const api = useApi()
  const [user, setUser] = useState<any>()
  const [error, setError] = useState('')

  const getMe = async () => {
    const [error, user] = await api.get(`${environment.apiUrl}/user/me`)
    if (error) setError(error)
    else setUser(user)
  }

  useEffect(() => {
    getMe()
  }, [])

  const onLogout = async () => {
    await api.post(`${environment.apiUrl}/auth/logout`)
    Router.replace('/')
  }

  const onLogoutAll = async () => {
    await api.post(`${environment.apiUrl}/auth/logout-all`)
    Router.replace('/')
  }

  return (
    <main>
      <h1>Me</h1>
      {user && (
        <div>
          <pre>{JSON.stringify(user, null, 2)}</pre>
          <button onClick={onLogout}>Logout</button>
          <button onClick={onLogoutAll}>Logout All</button>
        </div>
      )}
      {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
    </main>
  )
}
