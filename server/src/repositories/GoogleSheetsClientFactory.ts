import GoogleSpreadsheet from 'google-spreadsheet';
import {google} from 'googleapis';
import {loggerFactory} from '../logger';
import {promisifyAll} from 'bluebird';
import {SheetsV4Client} from '../interfaces';

const logger = loggerFactory('googleSheetsRepo');

export class GoogleSheetsClientFactory {
  constructor(
    private readonly sheetId: string,
    private readonly iamEmail: string,
    private readonly iamPrivateKey: string,
  ) {}

  private getCredentials() {
    return {
      client_email: this.iamEmail,
      private_key: Buffer.from(this.iamPrivateKey, 'base64').toString('ascii'),
    };
  }

  async manufactureLegacyClient() {
    const credentials = this.getCredentials();
    const client = promisifyAll(new GoogleSpreadsheet(this.sheetId));

    try {
      await (client as any).useServiceAccountAuthAsync(credentials);
    } catch (err) {
      logger.error({err}, 'Bad google sheets credentials');
      throw err;
    }

    try {
      const configuredClient = await (client as any).getInfoAsync();
      logger.trace('Got authorized google sheets client');
      return configuredClient;
    } catch (err) {
      logger.error({err}, 'Error connecting to google sheets API');
      throw err;
    }
  }

  async manufactureV4Client(): Promise<SheetsV4Client> {
    const credentials = this.getCredentials();
    const auth = new google.auth.GoogleAuth({credentials});

    let authClient;
    try {
      authClient = await auth.getClient();
    } catch (err) {
      logger.error({err}, 'Error authenticating google api client');
    }

    return google.sheets({version: 'v4', auth: authClient}).spreadsheets.values;
  }
}
