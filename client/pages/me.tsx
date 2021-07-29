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

  return (
    <main>
      <h1>Me</h1>
      {user && <pre>{JSON.stringify(user, null, 2)}</pre>}
      {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
    </main>
  )
}
