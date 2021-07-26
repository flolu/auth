import {injectable} from 'inversify'

// TODO configure and read environment variables

@injectable()
export class ConfigService {
  public readonly environment = process.env.NODE_ENV
  public readonly isProduction = this.environment === 'production'
  public readonly clientUrl = 'http://localhost:3000'
  public readonly baseDomain = 'localhost'
  public readonly accessTokenSecret = process.env.ACCESS_TOKEN_SECRET!
  public readonly refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET!
}
