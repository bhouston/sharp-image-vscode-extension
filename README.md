# Sharp Image Tools

A VS Code and Cursor extension that adds image conversion and editing to the Explorer context menu. Right-click any supported image file to convert it to another format or apply edits (rotate, flip, trim, etc.) using the [sharp](https://sharp.pixelplumbing.com/) library.

**Author:** [Ben Houston](https://benhouston3d.com) | [GitHub](https://github.com/bhouston)

## Installation

- **VS Code**: Install from the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/) (when published) or install from VSIX.
- **Cursor**: Install from [Open VSX](https://open-vsx.org/) (when published) or install from VSIX.

To install from VSIX: build with `npm run package`, then use **Extensions: Install from VSIX...** and select the generated `.vsix` file.

## Usage

Right-click an image file in the Explorer. Two submenus appear:

### Convert Image

Convert the image to another format. The current format is excluded from the list. Supported target formats:

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

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `sharpImageTools.conversionQuality` | number | 95 | Quality for JPEG, WebP, AVIF, etc. (0–100) |
| `sharpImageTools.leaveOriginalWhenChangingFormat` | boolean | false | When converting, leave the original file and write to a new file (same name, target extension) |
| `sharpImageTools.leaveOriginalWhenEditing` | boolean | false | When editing, leave the original and write to a new file with the editing suffix |
| `sharpImageTools.editingSuffix` | string | "-edit" | Suffix used when leaving original on edit. Multiple edits stack: `photo.jpg` → `photo-edit.jpg` → `photo-edit-edit.jpg` |

## Replace vs Save-As Behavior

By default, the extension **replaces** the existing file (overwrites for edits; converts and deletes the original for format changes). This assumes you use version control (e.g. git) to recover if needed.

Enable **Leave original when changing format** or **Leave original when editing** to write to new files instead.

## License

MIT
