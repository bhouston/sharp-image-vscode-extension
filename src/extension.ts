import * as path from "path";
import * as vscode from "vscode";
import {
  convertToFormat,
  applyEdit,
  type EditOperation,
} from "./sharpOperations";

const SUPPORTED_IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".avif",
  ".tiff",
  ".tif",
  ".svg",
  ".heic",
  ".heif",
  ".jp2",
]);

function filterImageUris(uris: vscode.Uri[]): vscode.Uri[] {
  return uris.filter((u) => {
    const ext = path.extname(u.fsPath).toLowerCase();
    return SUPPORTED_IMAGE_EXTENSIONS.has(ext);
  });
}

function normalizeUris(
  uri: vscode.Uri | undefined,
  selectedResources?: vscode.Uri[]
): vscode.Uri[] {
  const first = uri ?? getSelectedFileUri();
  if (!first) {
    return [];
  }
  if (!selectedResources?.length) {
    return [first];
  }
  const seen = new Set<string>([first.toString()]);
  const result: vscode.Uri[] = [first];
  for (const u of selectedResources) {
    const key = u.toString();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(u);
    }
  }
  return result;
}

async function runConvert(uris: vscode.Uri[], format: string): Promise<void> {
  const run = async () => {
    for (const u of uris) {
      try {
        await convertToFormat(u, format, { silent: true });
      } catch {
        // Error already shown by convertToFormat; continue with rest
      }
    }
  };
  if (uris.length > 1) {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: `Converting images to ${format.toUpperCase()}…`,
        cancellable: false,
      },
      async (progress) => {
        const increment = 100 / uris.length;
        for (const u of uris) {
          try {
            await convertToFormat(u, format, { silent: true });
          } catch {
            // Error already shown by convertToFormat; continue with rest
          }
          progress.report({ increment });
        }
      }
    );
  } else {
    await run();
  }
}

async function runEdit(
  uris: vscode.Uri[],
  operation: EditOperation
): Promise<void> {
  const run = async () => {
    for (const u of uris) {
      try {
        await applyEdit(u, operation, { silent: true });
      } catch {
        // Error already shown by applyEdit; continue with rest
      }
    }
  };
  if (uris.length > 1) {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "Editing images…",
        cancellable: false,
      },
      async (progress) => {
        const increment = 100 / uris.length;
        for (const u of uris) {
          try {
            await applyEdit(u, operation, { silent: true });
          } catch {
            // Error already shown by applyEdit; continue with rest
          }
          progress.report({ increment });
        }
      }
    );
  } else {
    await run();
  }
}

export function activate(context: vscode.ExtensionContext): void {
  const convertFormats = [
    "jpeg",
    "png",
    "webp",
    "gif",
    "avif",
    "tiff",
    "heif",
    "jp2",
  ] as const;

  for (const format of convertFormats) {
    const command = `sharpImageTools.convertTo${format.charAt(0).toUpperCase()}${format.slice(1)}` as const;
    context.subscriptions.push(
      vscode.commands.registerCommand(
        command,
        async (uri: vscode.Uri, selectedResources?: vscode.Uri[]) => {
          const all = normalizeUris(uri, selectedResources);
          if (!all.length) {
            vscode.window.showErrorMessage(
              "Sharp Image Tools: No file selected. Right-click an image in the Explorer."
            );
            return;
          }
          const uris = filterImageUris(all);
          if (!uris.length) {
            return;
          }
          await runConvert(uris, format);
        }
      )
    );
  }

  const editCommands: { command: string; operation: EditOperation }[] = [
    { command: "sharpImageTools.rotateCw", operation: "rotateCw" },
    { command: "sharpImageTools.rotateCcw", operation: "rotateCcw" },
    { command: "sharpImageTools.flip", operation: "flip" },
    { command: "sharpImageTools.flop", operation: "flop" },
    { command: "sharpImageTools.trim", operation: "trim" },
    { command: "sharpImageTools.greyscale", operation: "greyscale" },
    { command: "sharpImageTools.negate", operation: "negate" },
  ];

  for (const { command, operation } of editCommands) {
    context.subscriptions.push(
      vscode.commands.registerCommand(
        command,
        async (uri: vscode.Uri, selectedResources?: vscode.Uri[]) => {
          const all = normalizeUris(uri, selectedResources);
          if (!all.length) {
            vscode.window.showErrorMessage(
              "Sharp Image Tools: No file selected. Right-click an image in the Explorer."
            );
            return;
          }
          const uris = filterImageUris(all);
          if (!uris.length) {
            return;
          }
          await runEdit(uris, operation);
        }
      )
    );
  }
}

function getSelectedFileUri(): vscode.Uri | undefined {
  if (vscode.window.activeTextEditor?.document.uri) {
    return vscode.window.activeTextEditor.document.uri;
  }
  return undefined;
}

export function deactivate(): void {}
