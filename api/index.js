const Koa = require('koa')
const app = new Koa()
const devices = require('./routes/devices')
const telemetry = require('./routes/telemetry')

const config = require('./config')
const cors = require('@koa/cors')
const bodyParser = require('koa-bodyparser')
const compress = require('koa-compress')

app.use(cors())
app.use(bodyParser())
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    console.error({ user: ctx.user, query: ctx.query, body: ctx.request.body })
    console.error(err)
    ctx.status = err.status || 500
    ctx.body = { error: err.message }
  }
})
app.use(compress({
  filter (contentType) {
    return /json/.test(contentType)
  },
  threshold: 1,
  gzip: {
    flush: require('zlib').constants.Z_SYNC_FLUSH
  },
  deflate: {
    flush: require('zlib').constants.Z_SYNC_FLUSH
  },
  br: true // disable brotli
}))

app.use(async (ctx, next) => {
  if (ctx.request.method === 'OPTIONS') return next()
  console.log(ctx.request.method)
  if (ctx.headers.token === config.token) {
    return next()
  }
  throw new Error('Unauthorized')
})

app
  .use(devices.routes())
  .use(devices.allowedMethods())
  .use(telemetry.routes())
  .use(telemetry.allowedMethods())

app.listen(process.env.PORT || 3001)
