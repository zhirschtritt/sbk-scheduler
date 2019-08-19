import {sheets_v4} from 'googleapis';

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

export type RowEntity = {
  save(): Promise<void>;
};

export type SheetRow<T> = T & RowEntity;

export interface SheetClient<T> {
  getRowsAsync(query: {query?: string}): Promise<SheetRow<T>[]>;
}

export type SheetsV4Client = sheets_v4.Resource$Spreadsheets$Values;
