import fs from 'fs';
import path from 'path';
import express, { Request, Response } from 'express';
import multer from 'multer';
import { validateWidthAndHeight, returnThumbPath } from '../../utilities/image';
import { validateFileExtension } from '../../utilities/files';

const images = express.Router();

images.get(
  '/',
  async (req: Request, res: Response): Promise<unknown | void> => {
    const width = req.query.width as string;
    const height = req.query.height as string;
    const filename = req.query.filename as unknown as string;

    const parsedWidth: number = parseInt(width);
    const parsedHeight: number = parseInt(height);

    try {
      await validateWidthAndHeight(filename, parsedWidth, parsedHeight);
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        message: 'Bad request'
      });
    }

    const imagePath = await returnThumbPath({
      width: parsedWidth,
      height: parsedHeight,
      imageName: filename
    });

    if (typeof imagePath === 'object' && 'error' in imagePath) {
      return res.status(404).json({
        message: 'Resource Not Found'
      });
    }

    const s = fs.createReadStream(imagePath);
    s.on('open', function () {
      res.set('Content-Type', 'jpg');
      s.pipe(res);
    });
    s.on('error', function () {
      return res.status(404).json({
        message: 'Resource Not Found'
      });
    });
  }
);

const multerFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: CallableFunction
) => {
  const isFileValid = validateFileExtension(file.mimetype);
  if (isFileValid) {
    cb(null, true);
  } else {
    cb(new Error('Validation failed'));
  }
};

const upload = multer({
  dest: `${path.resolve()}/images/full`,
  fileFilter: async (req, file, cb) => await multerFilter(req, file, cb)
});
const type = upload.single('recfile');

images.post('/', async (req: Request, res: Response): Promise<void> => {
  await type(req, res, async (err: unknown) => {
    if (err) {
      return res.status(415).json({
        message: 'Unsupported Media Type'
      });
    }

    const tempFile = req.file as Express.Multer.File;

    if (!tempFile) {
      return res.status(400).json({
        message: 'Bad request'
      });
    }

    const tempPath = tempFile.path;

    const destinationPath = await `${path.resolve()}/images/full/${
      tempFile.originalname
    }`;

    await fs.rename(tempPath, destinationPath, (err) => {
      if (err) throw err;
      return res.status(201).json({
        message: 'Created'
      });
    });
  });
});

export default images;
