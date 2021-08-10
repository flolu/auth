export const environment = {
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT!,
  isProduction: process.env.NEXT_PUBLIC_ENVIRONMENT! === 'production',
  gitHubClientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!,
  gitHubRedirectUri: process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URL!,
  apiUrl: process.env.NEXT_PUBLIC_API_URL!,
  websocketUrl: process.env.NEXT_PUBLIC_REALTIME_URL!,

  baseDomain: process.env.BASE_DOMAIN!,
}
