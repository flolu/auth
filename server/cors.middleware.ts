import cors from 'cors'

export function corsMiddleware(isProd: boolean, ...whitelist: string[]) {
  return cors({
    origin: (
      origin,
      callback: (error: Error | null, allow: boolean) => void
    ) => {
      if (!isProd) return callback(null, true)
      if (origin === undefined) return callback(null, true)
      if (origin && whitelist.includes(origin)) callback(null, true)
      else callback(new Error('Not allowed by CORS'), false)
    },
    credentials: true,
  })
}
