import {injectable, postConstruct} from 'inversify'

import {Database} from '../database'
import {Id} from '../id'
import {UserDocument} from './user.schema'

@injectable()
export class UserService {
  constructor(private database: Database) {}

  @postConstruct()
  async init() {
    await this.database.waitForInitialized()

    const collection = await this.usersCollection()
    await collection.createIndexes(
      [
        {key: {id: 1}, name: 'id'},
        {key: {gitHubUserId: 1}, name: 'googleUserId'},
      ],
      {unique: true}
    )
  }

  async getById(id: string) {
    const collection = await this.usersCollection()
    return collection.findOne({id})
  }

  async getByGitHubUserId(gitHubUserId: number) {
    const collection = await this.usersCollection()
    return collection.findOne({gitHubUserId: gitHubUserId.toString()})
  }

  async create(name: string, gitHubUserId: number): Promise<UserDocument> {
    const collection = await this.usersCollection()
    const user = {
      id: Id.generate().toString(),
      name,
      tokenVersion: 0,
      gitHubUserId: gitHubUserId.toString(),
    }
    const result = await collection.insertOne(user)
    if (result.acknowledged) return user
    throw new Error()
  }

  async increaseTokenVersion(userId: string) {
    const collection = await this.usersCollection()
    const result = await collection.findOneAndUpdate(
      {id: userId},
      {$inc: {tokenVersion: 1}}
    )
    if (result.ok) return result.value
    throw new Error()
  }

  private usersCollection() {
    return this.database.collection<UserDocument>('users')
  }
}
