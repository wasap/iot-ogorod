const Router = require('@koa/router')
const router = new Router()
const telemetry = require('../services/telemetry')

router.get('/telemetry/:id/:date?', async ctx => {
  ctx.body = await telemetry.getTelemetry(ctx.params.id, ctx.params.date)
})

router.post('/telemetry/:id', async ctx => {
  const data = ctx.request.body
  const { id } = ctx.params
  console.log('telemtry', data)
  if (typeof data[0] !== 'number') {
    ctx.status = 403
    ctx.body = { error: `Invalid telemetry ${JSON.stringify(data)}` }
    return
  }
  await telemetry.saveHistory({ id, data })

  if (data[0] < 5) {
    await telemetry.sendTgAlarm({ id, data })
  }
  ctx.status = 200
  ctx.body = { ok: 1 }
})

module.exports = router
