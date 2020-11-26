const moment = require('moment')
const { Storage } = require('@google-cloud/storage')
const storage = new Storage()
const { Datastore } = require('@google-cloud/datastore')
const config = require('../config')
const Router = require('@koa/router')
const router = new Router()

const iot = require('@google-cloud/iot')
const iotClient = new iot.v1.DeviceManagerClient({
  // optional auth parameters.
})

// Creates a client
const datastore = new Datastore()

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

router.get('/telemetry/:id/:date?', async ctx => {
  ctx.body = await getTelemetry(ctx.params.id, ctx.params.date)
})

router.post('/telemetry/:id', async ctx => {
  const [device] = await datastore.get(datastore.key(['Devices', +ctx.params.id]))
  const formattedName = iotClient.devicePath(
    config.projectId,
    config.cloudRegion,
    device.registryId,
    device.deviceId
  )
  const binaryData = Buffer.from(JSON.stringify({ deviceType: device.type }))
  const request = {
    name: formattedName,
    binaryData: binaryData
  }
  // eslint-disable-next-line no-unused-vars
  const responses = await iotClient.sendCommandToDevice(request)
  ctx.status = 200
  ctx.body = { ok: 1 }
})

module.exports = router
