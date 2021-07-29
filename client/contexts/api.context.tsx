import {createContext, FC, useContext} from 'react'

import {Api} from '../lib/api'
import {ClientApi} from '../lib/client-api'

export const ApiContextImpl = createContext<Api>(null!)

export function useApi() {
  return useContext(ApiContextImpl)
}

export const ApiProvider: FC = ({children}) => {
  const api = new ClientApi()

  return (
    <ApiContextImpl.Provider value={api}>{children}</ApiContextImpl.Provider>
  )
}
