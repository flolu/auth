import {GitHubIcon} from 'icons/github'
import {environment} from 'lib/environment'
import Link from 'next/link'

const gitHubUrl = `https://github.com/login/oauth/authorize?client_id=${environment.gitHubClientId}&redirect_uri=${environment.gitHubRedirectUri}?path=/me&scope=user:email`

export function GitHubSignIn() {
  return (
    <Link href={gitHubUrl}>
      <a className="flex bg-gray-900 text-white items-center px-4 py-2 space-x-4 rounded font-medium">
        <span className="w-8 fill-current">
          <GitHubIcon />
        </span>
        <span>Sign in with GitHub</span>
      </a>
    </Link>
  )
}
