import {useUser} from 'contexts/user.context'
import {environment} from 'lib/environment'
import {withUser} from 'lib/get-props'
import {FC, useEffect} from 'react'

const Realtime: FC = () => {
  const {user} = useUser()

  useEffect(() => {
    const websocket = new WebSocket(environment.websocketUrl)

    websocket.onopen = () => {
      websocket.send('Hi from client')
    }

    websocket.onmessage = message => {
      console.log(message.data)
    }
  }, [])

  return (
    <main>
      <h1>Realtime</h1>
      {user && user.name}
    </main>
  )
}

export default Realtime

export const getServerSideProps = withUser()
