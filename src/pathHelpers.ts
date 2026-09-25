import * as path from 'path';

// Pure filename logic, kept free of the `vscode` import so it can be unit-tested outside the extension host.

export const FORMAT_TO_EXTENSION: Record<string, string> = {
  jpeg: '.jpg',
  png: '.png',
  webp: '.webp',
  gif: '.gif',
  avif: '.avif',
  tiff: '.tiff',
  heif: '.heif',
  jp2: '.jp2',
};

export function getOutputPathForConvert(inputPath: string, targetFormat: string): string {
  const dir = path.dirname(inputPath);
  const ext = path.extname(inputPath);
  const baseWithoutExt = path.basename(inputPath, ext);
  const targetExt = FORMAT_TO_EXTENSION[targetFormat] ?? `.${targetFormat}`;
  return path.join(dir, `${baseWithoutExt}${targetExt}`);
}

export function getOutputPathForEdit(inputPath: string, leaveOriginal: boolean, editingSuffix: string): string {
  if (!leaveOriginal) {
    return inputPath;
  }

  const dir = path.dirname(inputPath);
  const ext = path.extname(inputPath);
  const baseWithSuffix = path.basename(inputPath, ext);

  const newBase = baseWithSuffix + editingSuffix;
  return path.join(dir, `${newBase}${ext}`);
}
