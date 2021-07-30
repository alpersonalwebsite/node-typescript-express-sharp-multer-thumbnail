import { validateFileExtension } from '../../utilities/files';

describe('Testing Files library utilities', () => {
  describe('... validateFileExtension()', () => {
    it('returns true if the mime type is image/jpeg', () => {
      const result = validateFileExtension('image/jpeg');

      expect(result).toBeTrue();
    });
    it('returns false if the mime type is OTHER than image/jpeg', () => {
      const result = validateFileExtension('image/png');

      expect(result).toBeFalse();
    });
  });
});
