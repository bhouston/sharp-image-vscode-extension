import * as vscode from "vscode";
import { convertToFormat, applyEdit, type EditOperation } from "./sharpOperations";

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
      vscode.commands.registerCommand(command, async (uri: vscode.Uri) => {
        const resource = uri ?? getSelectedFileUri();
        if (!resource) {
          vscode.window.showErrorMessage(
            "Sharp Image Tools: No file selected. Right-click an image in the Explorer."
          );
          return;
        }
        await convertToFormat(resource, format);
      })
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
      vscode.commands.registerCommand(command, async (uri: vscode.Uri) => {
        const resource = uri ?? getSelectedFileUri();
        if (!resource) {
          vscode.window.showErrorMessage(
            "Sharp Image Tools: No file selected. Right-click an image in the Explorer."
          );
          return;
        }
        await applyEdit(resource, operation);
      })
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
