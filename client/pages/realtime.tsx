import {environment} from 'lib/environment'
import {refreshTokens} from 'lib/fetcher'
import {withUser} from 'lib/get-props'
import {useEffect, useRef, useState} from 'react'

const Realtime = () => {
  const ws = useRef<WebSocket>()
  const [isReconnecting, setReconnecting] = useState(false)
  const [isOpen, setOpen] = useState(false)

  const [messages, setMessages] = useState<any[]>([])
  const [value, setValue] = useState('')

  useEffect(() => {
    if (isReconnecting) return

    if (!ws.current) {
      ws.current = new WebSocket(environment.websocketUrl)
      ws.current.onopen = () => setOpen(true)
      ws.current.onclose = async () => {
        setOpen(false)
        setReconnecting(true)
        await refreshTokens()
        setReconnecting(false)
      }
    }

    return () => {
      if (ws.current) {
        ws.current.close()
        ws.current = undefined
      }
    }
  }, [isReconnecting])

  useEffect(() => {
    if (ws.current) {
      ws.current.onmessage = msg => {
        const parsed = JSON.parse(msg.data)
        setMessages([...messages, parsed])
      }
    }
  }, [isReconnecting, messages])

  const send = () => {
    if (ws.current && isOpen) {
      ws.current.send(value)
      setValue('')
    }
  }

  return (
    <main className="flex items-center justify-center h-full">
      <div className="space-y-4 text-center">
        <h1 className="px-4 py-2 text-lg font-medium bg-gray-200 rounded">
          Websocket authentication
        </h1>

        <div>
          {isOpen ? (
            <p className="text-green-500">Connected</p>
          ) : (
            <p className="text-red-500">Disconnected</p>
          )}
        </div>

        <div className="flex flex-col space-y-2">
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
