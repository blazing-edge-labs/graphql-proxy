require('./env')

const app = new (require('koa'))()
const got = require('got')

const cache = require('./cache')
const check = require('./check')
const hash = require('./hash')

app.proxy = true
app.silent = true
app.use(require('kcors')())
app.use(require('koa-bodyparser')())
app.use(require('koa-error')())

app.use(async ctx => {
  const {query, variables} = ctx.request.body
  const key = `${hash(query)}${hash(variables)}`
  const ignored = check.ignored(query, variables)

  if (!ignored) {
    const cached = await cache.get(key)
    if (cached) {
      ctx.body = cached
      return
    }
  }

  const r = await got.post(process.env.GRAPHQL_URL, {
    json: true,
    body: ctx.request.body,
    headers: ctx.request.header,
  })

  if (!ignored) {
    await cache.set(key, r.body)
  }
  ctx.body = r.body
})

app.listen(process.env.PORT, function () {
  console.log(`STARTED ENV=${process.env.NODE_ENV} PORT=${process.env.PORT}`)
})
