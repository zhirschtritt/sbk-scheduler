/* eslint-disable @typescript-eslint/camelcase */
module.exports = {
  host: 'localhost',
  port: process.env.PORT,
  public: '../../client/',
  paginate: {
    default: 10,
    max: 50,
  },
  googleSheetId: '1UewOFwvwJCivcHt60CO1GxRD3YH2Ayd3BD4Ik0uFKr8',
  termLength: 90,
  maxCacheTime: 60,
  iam_client_email: process.env.IAM_EMAIL,
  iam_private_key_base64: process.env.IAM_PRIVATE_KEY_BASE64,
  mailgunApiKey: process.env.MAILGUN_API,
  mailgunDomain: 'notifications.somervillebikekitchen.org',
  staffEmail: 'staff@somervillebikekitchen.org',
  twilioSid: process.env.TWILIO_SID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  twilioFromNumber: process.env.TWILIO_FROM_NUMBER,
};
