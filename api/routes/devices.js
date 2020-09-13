const router = require('express').Router();
const {Datastore} = require('@google-cloud/datastore');

// Creates a client
const datastore = new Datastore();

router.get('/devices', async (req, res) => {
  const query = datastore.createQuery('Devices')
  const [devices] = await datastore.runQuery(query)
  return res.json(devices.map(x => {
    x.id=x[Datastore.KEY].id
    return x
  }))
})
router.post('/devices/:id', async(req,res) => {
  const [device] = await datastore.get(datastore.key(['Devices',+req.params.id]))
  device.on = req.body.on
  device.disableDate = req.body.disableDate
  await datastore.update(device)
  // console.dir(up, {depth:null})
  res.status(201).send()
})
module.exports = router
