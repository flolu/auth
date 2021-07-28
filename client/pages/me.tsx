import axios from 'axios'
import {useEffect, useState} from 'react'

import {environment} from '../lib/environment'

export default function Me() {
  const [user, setUser] = useState()
  const [error, setError] = useState()

  const getMe = async () => {
    try {
      const response = await axios.get(`${environment.apiUrl}/user/me`, {
        withCredentials: true,
      })
      setUser(response.data)
    } catch (err) {
      setError(err)
    }
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
