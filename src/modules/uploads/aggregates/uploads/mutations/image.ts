import { Context, MutationResult, AppError, validateAuthenticate } from '@app/core';
import fs from 'fs';
import util from 'util';
import { config } from '@app/config';
import sharp from 'sharp';
import { v4 } from 'uuid';
import { FileUploadResult, File, SharpImageFileInfo } from '../interfaces';

const removeFile = async (filePath: string): Promise<void> => {
  const unlinkAsync = util.promisify(fs.unlink);
  await unlinkAsync(filePath);
};

const compressImage = (filename: string, readStream: fs.ReadStream): Promise<FileUploadResult> => {
  return new Promise((resolve, reject) => {
    const outputFile = `uploads/images/${filename}`;
    const writeStream = fs.createWriteStream(outputFile);

    const transformer = sharp()
      .jpeg({
        force: true,
      })
      .on('info', async (info: SharpImageFileInfo) => {
        // 2.2 Validate file size
        if (info.size > config.uploads.allowedImageSize) {
          // Remove file
          await removeFile(outputFile);

          // Throw error
          reject(new AppError('File too large (<= 10MB)', 'uploads/file-too-large'));
        } else {
          resolve({
            filename,
            url: `/static/images/${filename}`,
          });
        }
      });
    readStream.pipe(transformer).pipe(writeStream);
  });
};

export const handler = async (
  filePromise: Promise<File>,
  context: Context,
): Promise<MutationResult<FileUploadResult>> => {
  // 1. Authenticate
  validateAuthenticate(context.user);

  // 2. Validate file
  if (!filePromise) {
    throw new AppError('File not found', 'uploads/file-not-found');
  }

  const file = await filePromise;
  const filename = `${v4()}.png`;
  const readStream = file.createReadStream();

  // 2.1 Validate file type
  if (!config.uploads.allowedImageExt.test(file.filename)) {
    // Throw error
    throw new AppError('Invalid file type', 'uploads/invalid-file-type');
  }

  // Compress image
  const result = await compressImage(filename, readStream);
  return result;
};
