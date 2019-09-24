/* eslint-disable @typescript-eslint/camelcase */
require('dotenv').config();

module.exports = {
  host: 'localhost',
  port: 3030,
  socketioPort: 3031,
  public: '../../public/',
  paginate: {
    default: 10,
    max: 50,
  },
  googleSheetId: '1VzQtS9vqHS4p-2sXpvguNzmrzdCtvHVkfULm_sG_QhE',
  termLength: 90,
  maxCacheTime: 60,
  iam_client_email: process.env.IAM_EMAIL,
  iam_private_key_base64: process.env.IAM_PRIVATE_KEY_BASE64,
  mailgunApiKey: process.env.MAILGUN_API,
  mailgunDomain: 'sandboxa9c7bc9dadac4c7facd4f1c2b5cfb148.mailgun.org',
  staffEmail: 'zhirschtritt@gmail.com',
  twilioSid: process.env.TWILIO_SID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  twilioFromNumber: '15005550006',
};
