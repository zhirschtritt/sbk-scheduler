import GoogleSpreadsheet from 'google-spreadsheet';
import {loggerFactory} from './logger';
import {promisifyAll} from 'bluebird';

const logger = loggerFactory('googleSheetsRepo');

export class GoogleSheetsClientFactory {
  constructor(
    private readonly sheetId: string,
    private readonly iamEmail: string,
    private readonly iamPrivateKey: string,
  ) {}

  async manufacture() {
    const credentials = {
      client_email: this.iamEmail,
      private_key: Buffer.from(this.iamPrivateKey, 'base64').toString('ascii'),
    };

    const client = promisifyAll(new GoogleSpreadsheet(this.sheetId));

    try {
      await (client as any).useServiceAccountAuthAsync(credentials);
    } catch (err) {
      logger.error({err}, 'Bad google sheets credentials');
      throw err;
    }

    try {
      const configuredClient = await (client as any).getInfoAsync();
      logger.info('Got authorized google sheets client 👌');
      return configuredClient;
    } catch (err) {
      logger.error({err}, 'Error connecting to google sheets API');
      throw err;
    }
  }
}

export interface GoogleWorksheet {
  id: string;
  url: string;
  title: string;
  rowCount: number;
  colCount: number;
}

export interface GoogleSpreadSheetClient {
  worksheets: GoogleWorksheet[];
}
