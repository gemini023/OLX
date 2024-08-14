import * as multer from 'multer';
import { extname } from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.split('.')[0];
        const fileExtName = extname(file.originalname);
        cb(null, `${name}-${Date.now()}${fileExtName}`);
    },
});

const fileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

const upload = multer({ storage, fileFilter });

