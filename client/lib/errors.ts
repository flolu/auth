import {AxiosError} from 'axios'

export const getError = (error: AxiosError) => {
  if (error.isAxiosError && error.response) return error.response.data
  return 'Unexpected error'
}
