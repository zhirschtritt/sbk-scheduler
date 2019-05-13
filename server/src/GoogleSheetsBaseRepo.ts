import {GoogleSpreadSheetClient} from './GoogleSheetsClientFactory';
import {promisifyAll} from 'bluebird';
import {loggerFactory} from './logger';

const logger = loggerFactory('GoogleSheetsBaseRepo');

export type RowEntity = {
  save(): Promise<void>;
};

export type SheetRow<T> = T & RowEntity;

export interface SheetClient<T> {
  getRowsAsync(query: {query?: string}): Promise<SheetRow<T>[]>;
}

export class GoogleSheetsBaseRepository<T> {
  private readonly sheetClient: SheetClient<T>;

  constructor(
    spreadSheetClient: GoogleSpreadSheetClient,
    private readonly sheetName: 'Shifts' | 'Terms' | 'Staff' | 'Members',
  ) {
    const sheet = spreadSheetClient.worksheets.find(sheet => sheet.title === sheetName);

    if (!sheet) {
      logger.error({sheetName}, 'Could not find google spreadsheet');
      throw new Error(`Could not find google spreadsheet: ${sheetName}`);
    }

    this.sheetClient = (promisifyAll(sheet) as unknown) as SheetClient<T>;
  }

  protected async find(query: string) {
    try {
      return await this.sheetClient.getRowsAsync({query});
    } catch (err) {
      logger.error({err, query}, `Could not find by query on sheet: ${this.sheetName}`);
      throw err;
    }
  }

  async findAll() {
    try {
      return await this.sheetClient.getRowsAsync({});
    } catch (err) {
      logger.error({err}, `Could not findAll on sheet: ${this.sheetName}`);
      throw err;
    }
  }

  async findOneById(id: string): Promise<SheetRow<T>> {
    try {
      const res = await this.sheetClient.getRowsAsync({query: `id = ${id}`});
      if (!res.length) {
        throw new Error('No rows matching id');
      }
      return res[0];
    } catch (err) {
      throw err;
    }
  }
}