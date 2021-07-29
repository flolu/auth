import Link from 'next/link'

import {environment} from '../lib/environment'

const gitHubUrl = `https://github.com/login/oauth/authorize?client_id=${environment.gitHubClientId}&redirect_uri=${environment.gitHubRedirectUri}?path=/me&scope=user:email`

export default function Home() {
  return (
    <main>
      <h1>Auth</h1>
      <Link href={gitHubUrl}>
        <a>Sign in with GitHub</a>
      </Link>
    </main>
  )
}
