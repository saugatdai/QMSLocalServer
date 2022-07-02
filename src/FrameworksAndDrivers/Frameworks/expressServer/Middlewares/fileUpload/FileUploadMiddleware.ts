import multer from 'multer';

export type uploadFileInfo = {
  fileLocation: string,
  fileName: string;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLocaleLowerCase().split(' ').join('-');
    cb(null, fileName);
  }
});

export default multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/x-zip-compressed') {
      cb(null, false);
      return cb(new Error('Only Zip file is allowed for upload'));
    } else {
      cb(null, true);
    }
  }
});