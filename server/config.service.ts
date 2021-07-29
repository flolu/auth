import {injectable} from 'inversify'

@injectable()
export class ConfigService {
  public readonly environment = process.env.NODE_ENV!
  public readonly isProduction = this.environment === 'production'
  public readonly clientUrl = process.env.CLIENT_URL!
  public readonly baseDomain = process.env.BASE_DOMAIN!

  public readonly internalSecret = process.env.INTERNAL_SECRET!
  public readonly accessTokenSecret = process.env.ACCESS_TOKEN_SECRET!
  public readonly refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET!

  public readonly gitHubClientId = process.env.GITHUB_CLIENT_ID!
  public readonly gitHubClientSecret = process.env.GITHUB_CLIENT_SECRET!

  public readonly mongoURL = process.env.MONGODB_URL!
  public readonly mongoUser = process.env.MONGODB_USER!
  public readonly mongoPassword = process.env.MONGODB_PASSWORD!
  public readonly mongoDatabase = process.env.MONGODB_DATABASE!
}
