import * as util from 'util';
import * as fs from 'fs';

export const readFile = (filename: string) =>
  util.promisify(fs.readFile)(filename, 'utf-8');
export const writeFile = (filename: string, data: string) =>
  util.promisify(fs.writeFile)(filename, data, 'utf-8');

export type ServerSettings = {
  portNumber: number;
}

export type KioskSettings = {
  kioskMode: string;
  showGeneral: boolean;
}

export type printSettings = {
  firstLine: string,
  secondLine: string,
  enablePrintTime: boolean,
  printStartTime: string,
  printStopTime: string
}
