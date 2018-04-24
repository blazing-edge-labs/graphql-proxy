const redis = new (require('ioredis'))(process.env.REDIS_URL)

async function set (key, data) {
  return redis.set(key, JSON.stringify(data), 'EX', process.env.TTL)
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
