import { describe, expect, it } from 'vitest';
import { getOutputPathForConvert, getOutputPathForEdit } from './pathHelpers';

describe('getOutputPathForConvert', () => {
  it('swaps the extension for a known format', () => {
    expect(getOutputPathForConvert('/a/b/photo.png', 'jpeg')).toBe('/a/b/photo.jpg');
  });

  it('falls back to `.<format>` for an unmapped format', () => {
    expect(getOutputPathForConvert('/a/b/photo.png', 'bmp')).toBe('/a/b/photo.bmp');
  });
});

describe('getOutputPathForEdit', () => {
  it('returns the input path unchanged when not leaving the original', () => {
    expect(getOutputPathForEdit('/a/b/photo.jpg', false, '-edit')).toBe('/a/b/photo.jpg');
  });

  it('inserts the suffix before the extension when leaving the original', () => {
    expect(getOutputPathForEdit('/a/b/photo.jpg', true, '-edit')).toBe('/a/b/photo-edit.jpg');
  });

  it('stacks the suffix on repeated edits', () => {
    expect(getOutputPathForEdit('/a/b/photo-edit.jpg', true, '-edit')).toBe('/a/b/photo-edit-edit.jpg');
  });
});
