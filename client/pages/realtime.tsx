import {environment} from 'lib/environment'
import {withUser} from 'lib/get-props'
import {useEffect, useRef, useState} from 'react'

const Realtime = () => {
  const [value, setValue] = useState('')
  const [messages, setMessages] = useState<any[]>([])
  const ws = useRef<WebSocket>(null!)

  useEffect(() => {
    ws.current = new WebSocket(environment.websocketUrl)

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
    <main className="flex items-center justify-center h-full">
      <div className="space-y-4 text-center">
        <h1 className="px-4 py-2 text-lg font-medium bg-gray-200 rounded">
          Websocket authentication
        </h1>
        <div className="flex flex-col space-y-2 overflow-hidden overflow-y-auto max-h-80">
          {messages.map((msg, index) => {
            return (
              <div key={index} className="self-start">
                <span className="p-1 px-2 text-sm bg-gray-200 rounded">{msg.text}</span>
              </div>
            )
          })}
        </div>
        <input
          className="w-full px-2 py-1 border-2 border-gray-200 rounded outline-none focus:border-gray-400"
          value={value}
          onChange={event => setValue(event.target.value)}
          onKeyPress={event => event.key === 'Enter' && send()}
          placeholder="Send a message"
        ></input>
      </div>
    </main>
  )
}

export default Realtime

export const getServerSideProps = withUser()
