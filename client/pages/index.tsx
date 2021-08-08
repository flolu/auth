import {GitHubSignIn} from 'components/github-sign-in'

export default function Home() {
  return (
    <main className="flex items-center justify-center h-full">
      <GitHubSignIn />
    </main>
  )
}
