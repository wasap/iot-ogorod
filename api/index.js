const Koa = require('koa');
const app = new Koa();
const devices = require('./routes/devices')
const config = require('./config');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
 
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
app.use(async (ctx, next)=>{
    if(ctx.headers.token === config.token){
        return next()
    }
    throw new Error('unauthorized')
})



  app
  .use(devices.routes())
  .use(devices.allowedMethods());
 
app.listen(process.env.PORT || 3001)