import {
  FULL_PATH,
  THUMB_PATH,
  getImagePath,
  checkIfImageExist,
  generateThumbnail,
  minimumHeight,
  minimumWidth,
  returnThumbPath,
  validateWidthAndHeight
} from '../../utilities/image';

describe('Testing Image library utilities', () => {
  const testFullImageName = 'test'; // no extension included since the own function JUST works with jpg
  const thumbImageData = {
    imageName: testFullImageName,
    width: 100,
    height: 100
  };
  const testThumbImageName = 'test-100-100.jpg';
  const testThumbImageType = 'thumb';

  describe('... getImagePath()', () => {
    it('generates the proper FULL path', () => {
      const result = getImagePath('full', 'imageName.jpg');
      const expectedResult = `${FULL_PATH}/imageName.jpg`;

      expect(result).toBe(expectedResult);
    });

    it('generates the proper THUMB path', () => {
      const result = getImagePath('thumb', 'imageName.jpg');
      const expectedResult = `${THUMB_PATH}/imageName.jpg`;

      expect(result).toBe(expectedResult);
    });
  });
  describe('... generateThumbnail()', () => {
    it('generates a thumb if width and height are inside the expected range', async () => {
      const thumbImageData = {
        imageName: testFullImageName,
        width: 300,
        height: 300
      };
      const result = await generateThumbnail(thumbImageData);
      const expectedResult = {
        width: 300,
        height: 300
      };

      expect(result).toEqual(expectedResult);
    });
  });
  describe('... checkIfImageExist()', () => {
    it('returns true if the thumbnail exists', async () => {
      const result = await checkIfImageExist(
        testThumbImageName,
        testThumbImageType
      );
      const expectedResult = true;

      expect(result).toBe(expectedResult);
    });
  });
  describe('... returnThumbPath()', () => {
    it('returns the proper path to the thumb image', async () => {
      const result = await returnThumbPath(thumbImageData);
      const expectedResult = `${THUMB_PATH}/${testThumbImageName}`;

      expect(result).toBe(expectedResult);
    });
  });
  describe('... validateWidthAndHeight()', () => {
    const imageName = 'test';
    const validWidth = minimumWidth + 1;
    const invalidWidth = minimumWidth - 1;
    const validHeight = minimumHeight + 1;
    const invalidHeight = minimumHeight - 1;
    it('returns ERROR: Invalid width if WIDTH is less than MIN expected value', async () => {
      try {
        await validateWidthAndHeight(imageName, invalidWidth, validHeight);
      } catch (err) {
        expect(err.message).toBe('Invalid width');
      }
    });
    it('returns ERROR: Invalid height if HEIGHT is less than MIN expected value', async () => {
      try {
        await validateWidthAndHeight(imageName, validWidth, invalidHeight);
      } catch (err) {
        expect(err.message).toBe('Invalid height');
      }
    });
    it('returns ERROR: Invalid height if WIDTH is NaN', async () => {
      const invalidWidth = parseInt('lalala');
      try {
        await validateWidthAndHeight(imageName, invalidWidth, validHeight);
      } catch (err) {
        expect(err.message).toBe('Wrong data type. Expected number.');
      }
    });
    it('returns ERROR: Invalid height if HEIGHT is NaN', async () => {
      const invalidHeight = parseInt('lalala');
      try {
        await validateWidthAndHeight(imageName, validWidth, invalidHeight);
      } catch (err) {
        expect(err.message).toBe('Wrong data type. Expected number.');
      }
    });
  });
});
