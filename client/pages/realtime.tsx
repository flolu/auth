import {environment} from 'lib/environment'
import {withUser} from 'lib/get-props'
import {FC, useEffect, useRef, useState} from 'react'

const Realtime: FC = () => {
  const [value, setValue] = useState('')
  const [messages, setMessages] = useState<any[]>([])
  const ws = useRef<WebSocket>(null!)

  useEffect(() => {
    ws.current = new WebSocket(environment.websocketUrl)
    ws.current.onopen = () => console.log('ws opened')
    ws.current.onclose = () => console.log('ws closed')

    return () => {
      ws.current.close()
    }
  }, [])

  useEffect(() => {
    ws.current.onmessage = msg => {
      const parsed = JSON.parse(msg.data)
      setMessages([...messages, parsed])
    }
  }, [messages])

  const send = () => {
    ws.current.send(value)
    setValue('')
  }

  return (
    <main>
      <h1>Realtime</h1>
      <div>
        {messages.map((msg, index) => {
          return (
            <div key={index}>
              <p title={msg.userId}>{msg.text}</p>
            </div>
          )
        })}
      </div>
      <input
        value={value}
        onChange={event => setValue(event.target.value)}
        onKeyPress={event => event.key === 'Enter' && send()}
      ></input>
    </main>
  )
}

export default Realtime

export const getServerSideProps = withUser()
