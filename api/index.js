const express = require('express')
const app = express()
const devices = require('./routes/devices')
const config = require('../config');
const cors = require('cors')
const bodyParser = require('body-parser')
 
app.use(cors())
app.use(bodyParser.json())
app.use((req,res,next)=>{
    if(req.headers.token === config.token){
        return next()
    }
    return next('unauthorized')
})
app.use(devices);
 
app.listen(3001)