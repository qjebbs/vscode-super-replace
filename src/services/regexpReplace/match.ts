import * as vscode from 'vscode';
import { IProcessReulst } from './interfaces';
import { matcheWorker } from './worker';

export async function superMatch(
    editor: vscode.TextEditor,
    scope: vscode.Range[] | vscode.TextDocument,
    find: string,
    replace: string,
    processor: (strings: string[], ...args: string[]) => Promise<IProcessReulst>,
    ...processorArgs: string[]
);
export async function superMatch(
    editor: vscode.TextEditor,
    scope: vscode.Range[] | vscode.TextDocument,
    find: string,
    replace: string,
    func: string,
    ...processorArgs: string[]
);
export async function superMatch(
    editor: vscode.TextEditor,
    scope: vscode.Range[] | vscode.TextDocument,
    find: string,
    replace: string,
    func: any,
    ...para: any[]
) {
    await matcheWorker(editor, scope, find, replace);
}