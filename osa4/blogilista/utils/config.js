/* eslint-disable no-undef */
require('dotenv').config()

let PORT = process.env.PORT
//testing, because test not appropiate due to Jest automatically defining environment variable NODE_ENV as test
//https://jestjs.io/docs/environment-variables
const MONGODB_URI = process.env.NODE_ENV === 'testing'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT
}