import * as vscode from 'vscode';
import { IProcessReulst } from './interfaces';
import { matcheWorker } from './worker';

export async function superMatch(
    editor: vscode.TextEditor,
    scope: vscode.Range[] | vscode.TextDocument,
    find: string
) {
    await matcheWorker(editor, scope, find);
}