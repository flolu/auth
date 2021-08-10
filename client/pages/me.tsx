import {Logout} from 'components/logout'
import {useUser} from 'contexts/user.context'
import {environment} from 'lib/environment'
import {fetcher} from 'lib/fetcher'
import Router from 'next/router'
import {useEffect} from 'react'

import {UserDocument} from '@shared'

export default function Me() {
  const {user, setUser} = useUser()

  const getMe = async () => {
    const [error, user] = await fetcher<UserDocument>(`${environment.apiUrl}/me`)
    if (!error && user) setUser(user)
    else Router.push('/')
  }

  useEffect(() => {
    if (!user) getMe()
  })

  return (
    <main className="flex items-center justify-center h-full">
      <div className="space-y-4 text-center">
        <h1 className="px-4 py-2 text-lg font-medium bg-gray-200 rounded">
          Client side authentication
        </h1>
        {user ? <p>Hi, {user.name} 👋</p> : <p>Loading...</p>}
        <Logout />
      </div>
    </main>
  )
}
