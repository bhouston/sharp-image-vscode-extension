import * as path from "path";
import * as fs from "fs";
import sharp from "sharp";
import * as vscode from "vscode";

const FORMAT_TO_EXTENSION: Record<string, string> = {
  jpeg: ".jpg",
  png: ".png",
  webp: ".webp",
  gif: ".gif",
  avif: ".avif",
  tiff: ".tiff",
  heif: ".heif",
  jp2: ".jp2",
};

const QUALITY_FORMATS = ["jpeg", "webp", "avif", "tiff", "jp2", "heif"];

function getConfig() {
  return vscode.workspace.getConfiguration("sharpImageTools");
}

function getOutputPathForConvert(
  inputPath: string,
  targetFormat: string,
  leaveOriginal: boolean
): string {
  const dir = path.dirname(inputPath);
  const ext = path.extname(inputPath);
  const baseWithoutExt = path.basename(inputPath, ext);

  const targetExt = FORMAT_TO_EXTENSION[targetFormat] ?? `.${targetFormat}`;
  const outputPath = path.join(dir, `${baseWithoutExt}${targetExt}`);

  if (leaveOriginal) {
    return outputPath;
  }
  return outputPath;
}

function getOutputPathForEdit(
  inputPath: string,
  leaveOriginal: boolean,
  editingSuffix: string
): string {
  if (!leaveOriginal) {
    return inputPath;
  }

  const dir = path.dirname(inputPath);
  const ext = path.extname(inputPath);
  const baseWithSuffix = path.basename(inputPath, ext);

  const newBase = baseWithSuffix + editingSuffix;
  return path.join(dir, `${newBase}${ext}`);
}

export async function convertToFormat(
  uri: vscode.Uri,
  targetFormat: string
): Promise<void> {
  const config = getConfig();
  const quality = Math.max(
    0,
    Math.min(100, config.get<number>("conversionQuality", 95) ?? 95)
  );
  const leaveOriginal = config.get<boolean>(
    "leaveOriginalWhenChangingFormat",
    false
  );

  const inputPath = uri.fsPath;
  const outputPath = getOutputPathForConvert(
    inputPath,
    targetFormat,
    leaveOriginal
  );

  const formatOptions: Record<string, unknown> = {};
  if (QUALITY_FORMATS.includes(targetFormat)) {
    formatOptions.quality = quality;
  }

  try {
    let pipeline = sharp(inputPath).toFormat(
      targetFormat as keyof sharp.FormatEnum,
      formatOptions
    );

    await pipeline.toFile(outputPath);

    if (!leaveOriginal && inputPath !== outputPath) {
      fs.unlinkSync(inputPath);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    vscode.window.showErrorMessage(`Sharp Image Tools: ${message}`);
    throw err;
  }

  if (leaveOriginal) {
    vscode.window.showInformationMessage(
      `Converted to ${targetFormat}: ${path.basename(outputPath)}`
    );
  }
}

export type EditOperation =
  | "rotateCw"
  | "rotateCcw"
  | "flip"
  | "flop"
  | "trim"
  | "greyscale"
  | "negate";

export async function applyEdit(
  uri: vscode.Uri,
  operation: EditOperation
): Promise<void> {
  const config = getConfig();
  const leaveOriginal = config.get<boolean>(
    "leaveOriginalWhenEditing",
    false
  );
  const editingSuffix = config.get<string>("editingSuffix", "-edit") ?? "-edit";

  const inputPath = uri.fsPath;
  const outputPath = getOutputPathForEdit(
    inputPath,
    leaveOriginal,
    editingSuffix
  );

  try {
    let pipeline = sharp(inputPath);

    switch (operation) {
      case "rotateCw":
        pipeline = pipeline.rotate(90);
        break;
      case "rotateCcw":
        pipeline = pipeline.rotate(-90);
        break;
      case "flip":
        pipeline = pipeline.flip();
        break;
      case "flop":
        pipeline = pipeline.flop();
        break;
      case "trim":
        pipeline = pipeline.trim();
        break;
      case "greyscale":
        pipeline = pipeline.greyscale();
        break;
      case "negate":
        pipeline = pipeline.negate();
        break;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }

    await pipeline.toFile(outputPath);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    vscode.window.showErrorMessage(`Sharp Image Tools: ${message}`);
    throw err;
  }

  if (leaveOriginal) {
    vscode.window.showInformationMessage(
      `Edited: ${path.basename(outputPath)}`
    );
  }
}
