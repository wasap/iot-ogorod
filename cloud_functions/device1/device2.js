/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */

const moment = require('moment')
const { Storage } = require('@google-cloud/storage')
const storage = new Storage()

const functions = require('@google-cloud/functions-framework');

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

// Register a CloudEvent callback with the Functions Framework that will
// be executed when the Pub/Sub trigger topic receives a message.
functions.cloudEvent('helloPubSub', async event => {
  // The Pub/Sub message is passed as the CloudEvent's data payload.
  const message = Buffer.from(event.data.message.data, 'base64').toString()
  console.log('message', message)
  let row;
  try{row = JSON.parse(message)} catch(e) {return};
  if(!row instanceof Array) return;
  const id = 5632499082330112;
   const telemetry = await getTelemetry(id)
  telemetry.push([Date.now(), row])

  const file = myBucket.file(`${id}/${getCurrentDate()}.json`)
  const contents = JSON.stringify(telemetry)

  await file.save(contents)

  if(row[0]>3) return;
  
  const TelegramBot = require('node-telegram-bot-api');

  // replace the value below with the Telegram token you receive from @BotFather
  const token = '1486100076:AAGji-s2GHy-9U5FhVL7e5RiQPgovAX4SfM';

  // Create a bot that uses 'polling' to fetch new updates
  const bot = new TelegramBot(token);
  await bot.sendMessage('-296842977', `<b>температура</b> ${row[0]}
<b>давление</b> ${row[1]}
<b>влажность</b> ${row[2]}`);
});




