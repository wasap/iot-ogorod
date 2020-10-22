const moment = require('moment')
const { Storage } = require('@google-cloud/storage')
const storage = new Storage()

const myBucket = storage.bucket('telemetry-123')

const getCurrentDate = () => moment().format('MM-YYYY')

const getTelemetry = async (id, date = getCurrentDate()) => {
  try {
    const telemetry = await myBucket.file(`${id}/${date}.json`).download()
    return JSON.parse(telemetry[0])
  } catch (e) {
    console.log(e)
    return []
  }
}

const Router = require('@koa/router')
const router = new Router()

router.get('/telemetry/:id/:date?', async ctx => {
  ctx.body = await getTelemetry(ctx.params.id, ctx.params.date)
})

router.post('/telemetry/:id', async ctx => {
  // const file =  storage.bucket('telemetry').file(`${ctx.params.id}/${getCurrentDate()}.json`)
  // await file.save(JSON.stringify(ctx.params.body));

  const telemetry = await getTelemetry(ctx.params.id, ctx.params.date)
  telemetry.push([Date.now(), ctx.request.body])

  const file = myBucket.file(`${ctx.params.id}/${getCurrentDate()}.json`)
  const contents = JSON.stringify(telemetry)

  await file.save(contents)
  ctx.status = 201
})

module.exports = router
