import {v4 as uuidv4} from 'uuid'

import {UserDocument} from '@shared'

import {config} from './config'
import {databaseClient} from './database'

function collection() {
  return databaseClient.db(config.mongoDatabase).collection<UserDocument>('users')
}

export async function setupUserIndexes() {
  const coll = await collection()
  await coll.createIndexes(
    [
      {key: {id: 1}, name: 'id'},
      {key: {gitHubUserId: 1}, name: 'googleUserId'},
    ],
    {unique: true}
  )
}

export async function createUser(name: string, gitHubUserId: number) {
  const user: UserDocument = {
    id: uuidv4(),
    name,
    tokenVersion: 0,
    gitHubUserId: gitHubUserId.toString(),
  }

  const coll = await collection()
  const result = await coll.insertOne(user)
  if (result.acknowledged) return user

  throw new Error()
}

export async function increaseTokenVersion(userId: string) {
  const coll = await collection()
  const result = await coll.findOneAndUpdate({id: userId}, {$inc: {tokenVersion: 1}})
  if (result.ok) return result.value

  throw new Error()
}

export async function getUserById(id: string) {
  const coll = await collection()
  return coll.findOne({id})
}

export async function getUserByGitHubId(gitHubUserId: number) {
  const coll = await collection()
  return coll.findOne({gitHubUserId: gitHubUserId.toString()})
}
