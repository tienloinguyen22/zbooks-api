import fs from 'fs';

export interface File {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => fs.ReadStream;
}
