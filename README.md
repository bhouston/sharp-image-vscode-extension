# Sharp Image Tools

A VS Code and Cursor extension that adds image conversion and editing to the Explorer context menu. Right-click any supported image file to convert it to another format or apply edits (rotate, flip, trim, etc.) using the [sharp](https://sharp.pixelplumbing.com/) library.

## Installation

- **VS Code**: Install from the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/) (when published) or install from VSIX.
- **Cursor**: Install from [Open VSX](https://open-vsx.org/) (when published) or install from VSIX.

To install from VSIX: run `npm run package`, then use **Extensions: Install from VSIX...** and select the generated `.vsix` file.

`npm run package` produces a **single ~40 MB VSIX with native binaries for all major platforms** — Windows x64, macOS arm64/x64, and Linux x64/arm64. It works out of the box on any of those platforms without recompilation.

## Usage

Right-click an image file in the Explorer. Two submenus appear:

### Multi-select

You can select multiple files in the Explorer and right-click to run Convert or Edit on all of them. Only image files in the selection are processed; non-image files are skipped silently (no notification). For **Convert Image** with multiple selection, all target formats are shown regardless of each file’s current format, so you can e.g. select a mix of PNG and WebP and convert all to JPEG in one action. No success toasts are shown when the operation completes; a progress indicator appears when processing two or more images.

### Convert Image

Convert the image to another format. With a single file, the current format is excluded from the list. Supported target formats:

- JPEG, PNG, WebP, GIF, AVIF, TIFF, HEIF, JP2

### Edit Image

- **Rotate 90° CW** / **Rotate 90° CCW** — Rotate by 90 degrees
- **Flip** — Mirror vertically
- **Flop** — Mirror horizontally
- **Trim** — Remove "boring" edges (same-colored borders)
- **Greyscale** — Convert to greyscale
- **Negate** — Produce the negative of the image

## Supported Input Formats

`.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, `.avif`, `.tiff`, `.tif`, `.svg`, `.heic`, `.heif`, `.jp2`

## Configuration

| Setting                                           | Type    | Default | Description                                                                                                             |
| ------------------------------------------------- | ------- | ------- | ----------------------------------------------------------------------------------------------------------------------- |
| `sharpImageTools.conversionQuality`               | number  | 95      | Quality for JPEG, WebP, AVIF, etc. (0–100)                                                                              |
| `sharpImageTools.leaveOriginalWhenChangingFormat` | boolean | false   | When converting, leave the original file and write to a new file (same name, target extension)                          |
| `sharpImageTools.leaveOriginalWhenEditing`        | boolean | false   | When editing, leave the original and write to a new file with the editing suffix                                        |
| `sharpImageTools.editingSuffix`                   | string  | "-edit" | Suffix used when leaving original on edit. Multiple edits stack: `photo.jpg` → `photo-edit.jpg` → `photo-edit-edit.jpg` |

## Replace vs Save-As Behavior

By default, the extension **replaces** the existing file (overwrites for edits; converts and deletes the original for format changes). This assumes you use version control (e.g. git) to recover if needed.

Enable **Leave original when changing format** or **Leave original when editing** to write to new files instead.

## License

MIT

## Author

[Ben Houston](https://ben3d.ca), Sponsored by [Land of Assets](https://landofassets.com)
