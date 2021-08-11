import * as mongodb from 'mongodb'

import {config} from './config'

const url = config.mongoURL
const user = config.mongoUser
const password = config.mongoPassword

export const databaseClient = new mongodb.MongoClient(url, {auth: {username: user, password}})
