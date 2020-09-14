const Router = require('@koa/router');
const router = new Router();
const {Datastore} = require('@google-cloud/datastore');

// Creates a client
const datastore = new Datastore();

router.get('/devices', async (ctx) => {
  const query = datastore.createQuery('Devices')
  const [devices] = await datastore.runQuery(query)
  ctx.body = (devices.map(x => {
    x.id=x[Datastore.KEY].id
    return x
  }))
})
router.post('/devices/:id', async(ctx) => {
  const [device] = await datastore.get(datastore.key(['Devices',+ctx.params.id]))
  device.on = ctx.request.body.on
  device.disableDate = ctx.request.body.disableDate
  await datastore.update(device)
  // console.dir(up, {depth:null})
  ctx.status = 201
})
module.exports = router
