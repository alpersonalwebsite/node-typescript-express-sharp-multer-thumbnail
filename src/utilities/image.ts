import { promises as fsPromises, PathLike } from 'fs';
import sharp from 'sharp';
import { CustomError } from '../types/index';

export const FULL_PATH = `./images/full`;
export const THUMB_PATH = `./images/thumbnail`;

// Pixel unit
export const minimumWidth = 50;
export const minimumHeight = 50;

export interface BasicImageData {
  width: number;
  height: number;
}

export interface ImageData extends BasicImageData {
  imageName: string;
  minWidth?: number;
  minHeight?: number;
}

export type ImageType = 'full' | 'thumb';

/**
 * Takes an ImageType and a string containing the name of the image and returns the full or thumb path
 * @param type which defines if it is a thumb or full image
 * @param imageName which is the name of the image
 * @returns path to full or thumb image
 */
export const getImagePath = (type: ImageType, imageName: string): string => {
  if (type === 'full') return `${FULL_PATH}/${imageName}`;
  else return `${THUMB_PATH}/${imageName}`;
};

/**
 * Takes an ImageType and a string containing the name of the image and returns true (if image can be open and read) or false
 * @param imageName which is the name of the image
 * @param imgType which is the type of the image either thumb or full
 * @returns a promise which resolves into a boolean
 */
export const checkIfImageExist = async (
  imageName: string,
  imgType: ImageType
): Promise<boolean> => {
  try {
    await fsPromises.readFile(getImagePath(imgType, `${imageName}`));
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * Validates the image width and height returning the user desired width/height or pre-defined dimensions
 * @param imageName which is the name of the image
 * @param width which is the width in pixels
 * @param height which is the height in pixels
 */
export const validateWidthAndHeight = async (
  imageName: string,
  width: number,
  height: number
): Promise<void> => {
  let fullImagePath;
  try {
    fullImagePath = await getImagePath('full', `${imageName}.jpg`);
  } catch (err) {
    console.log(err);
  }

  let fullImageMeta: void | sharp.Metadata;
  try {
    fullImageMeta = await sharp(fullImagePath).metadata();
  } catch (err) {
    console.log(err);
  }

  // Width should not be more than the own image width or less than X
  // In both cases, width and height, if fullImageMeta resolves properly, we can
  // safely assume that fullImageMeta will have the properties width and height
  // since they are part of the sharp.Metadata Interface

  if (isNaN(width) || isNaN(height))
    throw new Error('Wrong data type. Expected number.');

  if (
    fullImageMeta &&
    (width > (fullImageMeta.width as number) || width < minimumWidth)
  ) {
    throw new Error('Invalid width');
  }

  // Height should not be more than the own image height or less than X
  if (
    fullImageMeta &&
    (height > (fullImageMeta.height as number) || height < minimumHeight)
  ) {
    throw new Error('Invalid height');
  }
};

/**
 * Takes an object and tries to generate a thumbnail
 * @param imageData which is an object based on ImageData interface
 * @returns a promise which resolves into a boolean if the thumbnail is created or logs
 * the error to the console if not
 */
export const generateThumbnail = async (
  imageData: ImageData
): Promise<BasicImageData | void> => {
  const { imageName, width, height } = imageData;

  const fullImagePath = await getImagePath('full', `${imageName}.jpg`);

  try {
    await sharp(fullImagePath)
      .resize(width, height)
      .toFile(`${THUMB_PATH}/${imageName}-${width}-${height}.jpg`);
  } catch (err) {
    console.log(err);
  }

  return {
    width,
    height
  };
};

/**
 * Takes and object and returns the full path to the thumbnail
 * @param imageData which is an object based on ImageData interface
 * @returns a promise which resolves into a string containing the thumbnail full path
 */

export const returnThumbPath = async (
  imageData: ImageData
): Promise<PathLike | CustomError> => {
  const { imageName, width, height } = imageData;

  const thumbexist = await checkIfImageExist(
    `${imageName}-${width}-${height}.jpg`,
    'thumb'
  );

  const fullImgExist = await checkIfImageExist(`${imageName}.jpg`, 'full');

  if (!thumbexist) {
    if (fullImgExist) await generateThumbnail(imageData);
    else
      return {
        error: true,
        data: 'Original image does not exist!'
      };
  }

  return await getImagePath('thumb', `${imageName}-${width}-${height}.jpg`);
};
