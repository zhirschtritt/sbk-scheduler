module.exports = {
  host: 'localhost',
  port: process.env.PORT,
  public: '../public/',
  paginate: {
    default: 10,
    max: 50
  },
  googleSheetId: '1UewOFwvwJCivcHt60CO1GxRD3YH2Ayd3BD4Ik0uFKr8',
  shiftsID: 1,
  membersId: 2,
  termsId: 3,
  termLength: 90,
  maxCacheTime: 60,
  iam_client_email: process.env.IAM_EMAIL,
  iam_private_key_base64: process.env.IAM_PRIVATE_KEY_BASE64
};