const CronJob = require('cron').CronJob;
const axios = require('axios');

const baseUrl = process.env.NODE_ENV === 'production' ? 
  'https://schedule.somervillebikekitchen.org' :
  'http://localhost:3030';

const sundayNotification = new CronJob('0 0 10 * * SUN', async function() {
  axios.post(`${baseUrl}/notifications`, {})
    .then((res) => console.log(res ? res.data : res)) // eslint-disable-line
    .catch((err) => console.log(err)); // eslint-disable-line

}, null, false, 'America/New_York');

sundayNotification.start();