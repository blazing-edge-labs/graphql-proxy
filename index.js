require('./env')

const app = new (require('koa'))()

const cache = require('./cache')
const check = require('./check')
const hash = require('./hash')
const request = require('./request')

app.proxy = true
app.silent = true
app.use(require('kcors')())
app.use(require('koa-bodyparser')())
app.use(require('koa-error')())

app.use(async ctx => {
  const {query, variables} = ctx.request.body
  const key = `${hash(query)}${hash(variables)}`
  const ignored = check.ignored(query, variables)

  if (ignored) {
    const r = await request(ctx.request.body, ctx.request.headers)
    ctx.response.body = r.body
    ctx.response.headers = r.headers
    return
  }

  const cached = await cache.get(key)
  if (cached) {
    ctx.response.body = cached.body
    ctx.response.headers = cached.headers
    return
  }

  const r = await request(ctx.request.body, ctx.request.headers)
  await cache.set(key, {
    body: r.body,
    headers: r.headers,
  })
  ctx.response.body = r.body
  ctx.response.headers = r.headers
})

app.listen(process.env.PORT, function () {
  console.log(`STARTED ENV=${process.env.NODE_ENV} PORT=${process.env.PORT}`)
})
