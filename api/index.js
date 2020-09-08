const express = require('express')
const app = express()
const devices = require('./routes/devices')
 
app.use(devices);
 
app.listen(3001)