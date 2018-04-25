const _ = require('lodash')
const redis = new (require('ioredis'))(process.env.REDIS_URL)

const ttl = _.toInteger(process.env.TTL)

async function set (key, data) {
  return redis.set(key, JSON.stringify(data), 'EX', ttl)
}

async function get (key) {
  const data = await redis.get(key).catch(() => null)
  if (data) {
    return JSON.parse(data)
  }
  return null
}

module.exports = {
  get,
  set,
}
