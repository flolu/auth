import * as mongodb from 'mongodb'

import {config} from './config'

const url = config.mongoURL
const user = config.mongoUser
const password = config.mongoPassword
const databaseName = config.mongoDatabase
const client = new mongodb.MongoClient(url, {auth: {username: user, password}})

async function collection<T>(name: string) {
  return client.db(databaseName).collection<T>(name)
}

export const database = {client, collection}
