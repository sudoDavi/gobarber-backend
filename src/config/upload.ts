import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: tmpFolder,
  uploadDirectory: path.resolve(tmpFolder, 'uploads'),
  storage: multer.diskStorage({
    destination: tmpFolder,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('HEX');
      /* Could be using a better strategy than the one in the video
      to generate file names, something like this rather than using the
      name the file had.
      Creating a hash with the sum of those random bytes and the filename,
      that way the user can't inject malicious characters. */
      const fileName = `${fileHash}-${file.originalname.replace(/\s+/g, '')}`;

      return callback(null, fileName);
    },
  }),
};
