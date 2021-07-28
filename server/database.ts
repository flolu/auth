import retry from 'async-retry'
import {injectable, postConstruct} from 'inversify'
import * as mongodb from 'mongodb'

import {ConfigService} from './config.service'

@injectable()
export class Database {
  private url = this.config.mongoURL
  private user = this.config.mongoUser
  private password = this.config.mongoPassword
  private name = this.config.mongoDatabase
  private isInitialized = false
  private client = new mongodb.MongoClient(this.url, {
    auth: {username: this.user, password: this.password},
  })

  constructor(private config: ConfigService) {}

  @postConstruct()
  async init() {
    await this.waitForInitialized(true)
    this.isInitialized = true
    console.log('connected to db')
  }

  async collection<T>(name: string) {
    await this.waitForInitialized()
    const db = this.client.db(this.name)
    return db.collection<T>(name)
  }

  async waitForInitialized(skipInitCheck = false) {
    if (this.isInitialized) return

    await this.client.connect()

    if (!this.isInitialized && !skipInitCheck) {
      await retry(() => {
        if (!this.isInitialized) throw new Error()
      })
    }
  }
}
