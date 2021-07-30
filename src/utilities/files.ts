export const validateFileExtension = (mimeType: string): boolean => {
  if (mimeType !== 'image/jpeg') {
    return false;
  }

  return true;
};
