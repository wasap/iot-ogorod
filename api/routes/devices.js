const Router = require('@koa/router')
const router = new Router()
const { Datastore } = require('@google-cloud/datastore')
const config = require('../config')

const iot = require('@google-cloud/iot')
const iotClient = new iot.v1.DeviceManagerClient({
  // optional auth parameters.
})

// Creates a client
const datastore = new Datastore()

router.get('/devices', async (ctx) => {
  const query = datastore.createQuery('Devices')
  const [devices] = await datastore.runQuery(query)
  ctx.body = (devices.map(x => {
    x.id = x[Datastore.KEY].id
    return x
  }))
})
router.post('/devices/:id', async (ctx) => {
  const [device] = await datastore.get(datastore.key(['Devices', +ctx.params.id]))
  device.on = ctx.request.body.on
  device.disableDate = ctx.request.body.disableDate

  const formattedName = iotClient.devicePath(
    config.projectId,
    config.cloudRegion,
    config.registryId,
    device.deviceId
  )
  const binaryData = Buffer.from(JSON.stringify({ isOn: device.on, disableSecs: ctx.request.body.disableSecs, isCommand: true }))
  const request = {
    name: formattedName,
    binaryData: binaryData
  }
  // eslint-disable-next-line no-unused-vars
  const responses = await iotClient.sendCommandToDevice(request)
  await datastore.update(device)

  ctx.status = 201
})
module.exports = router
