import {useUser} from 'contexts/user.context'
import {environment} from 'lib/environment'
import Link from 'next/link'
import {FC} from 'react'

const gitHubUrl = `https://github.com/login/oauth/authorize?client_id=${environment.gitHubClientId}&redirect_uri=${environment.gitHubRedirectUri}?path=/me&scope=user:email`

export const Navigation: FC = () => {
  const {user} = useUser()

  return (
    <div>
      {user && (
        <>
          <Link href="/me">
            <a>Me</a>
          </Link>
          <br></br>
          <Link href="/me-ssr">
            <a>Me SSR</a>
          </Link>
          <br></br>
          <Link href="/realtime">
            <a>Realtime</a>
          </Link>
        </>
      )}
      {!user && (
        <>
          <Link href={gitHubUrl}>
            <a>Sign in with GitHub</a>
          </Link>
        </>
      )}
    </div>
  )
}
