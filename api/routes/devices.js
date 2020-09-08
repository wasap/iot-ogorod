const router = require('express').Router();
router.use('/devices', async (req, res) => {
  res.json([{
name: 'кран',
img: 'http://localhost:3000/img/cran.png',
disableDate: '',
status: 'enabled'
  }])
})
module.exports = router
