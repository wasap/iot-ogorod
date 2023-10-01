const moment = require('moment')
const { Storage } = require('@google-cloud/storage')
const storage = new Storage()
const { Datastore } = require('@google-cloud/datastore')
const config = require('../config')
const datastore = new Datastore()

const myBucket = storage.bucket('telemetry-123')

class Telemetry {
  getCurrentDate () {
    return moment().format('MM-YYYY')
  }

  async getTelemetry (id, date = this.getCurrentDate()) {
    try {
      const [telemetry] = await myBucket.file(`${id}/${date}.json`).download()
      return JSON.parse(telemetry)
    } catch (e) {
      console.log(String(e))
      return []
    }
  }

  async saveHistory ({ id, data }) {
    const history = await this.getTelemetry(id)
    history.push([Date.now(), data])
    const file = myBucket.file(`${id}/${this.getCurrentDate()}.json`)
    const contents = JSON.stringify(history)

    await file.save(contents)
  }

  async sendTgAlarm ({ id, data }) {
    const [device] = await datastore.get(datastore.key(['Devices', +id]))
    const TelegramBot = require('node-telegram-bot-api')

    // replace the value below with the Telegram token you receive from @BotFather
    const token = config.telegramBotToken

    // Create a bot that uses 'polling' to fetch new updates
    const bot = new TelegramBot(token)
    await bot.sendMessage(config.telegramChatId, `<b>${device.name}</b>
<b>температура</b> ${data[0]}
<b>давление</b> ${data[1]}
<b>влажность</b> ${data[2]}`)
  }

  async listDevices () {
    const query = datastore.createQuery('Devices')
    const [devices] = await datastore.runQuery(query)
    return devices.map(x => {
      x.id = x[Datastore.KEY].id
      return x
    })
  }
}

module.exports = new Telemetry()
