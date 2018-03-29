import * as vscode from 'vscode';

export var context: vscode.ExtensionContext;

export function setContext(ctx: vscode.ExtensionContext) {
    context = ctx;
}