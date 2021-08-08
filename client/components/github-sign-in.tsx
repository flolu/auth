import {GitHubIcon} from 'icons/github'
import {environment} from 'lib/environment'
import Link from 'next/link'

const gitHubUrl = `https://github.com/login/oauth/authorize?client_id=${environment.gitHubClientId}&redirect_uri=${environment.gitHubRedirectUri}?scope=user:email`

export function GitHubSignIn() {
  return (
    <Link href={gitHubUrl}>
      <a className="flex items-center px-4 py-2 space-x-4 font-medium text-white bg-gray-900 rounded">
        <span className="w-8 fill-current">
          <GitHubIcon />
        </span>
        <span>Sign in with GitHub</span>
      </a>
    </Link>
  )
}
