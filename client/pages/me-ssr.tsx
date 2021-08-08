import {Logout} from 'components/logout'
import {useUser} from 'contexts/user.context'
import {withUser} from 'lib/get-props'
import {FC} from 'react'

const MeSSR: FC = () => {
  const {user} = useUser()

  return (
    <main className="flex items-center justify-center h-full">
      <div className="text-center space-y-4">
        <h1 className="px-4 py-2 text-lg font-medium bg-gray-200 rounded">
          Server side authentication
        </h1>
        <p>Hi, {user!.name} 👋</p>
        <Logout />
      </div>
    </main>
  )
}

export default MeSSR

export const getServerSideProps = withUser()
