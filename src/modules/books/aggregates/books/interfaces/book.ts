import { Aggregate, IsAuditable } from '@app/core';

export interface Book extends Aggregate, IsAuditable {
  title: string;
  author: string;
  description: string;
  category: string[];
  year: string;
  publisher: string;
  language: string;
  pages: number;
  fileInfo: string;
  downloadUrl: string;
  referer: string;
  coverUrl: string;
  downloadCount: number;
}
