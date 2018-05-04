
import * as vscode from 'vscode';
import { IProcessReulst } from './interfaces';
import { analysis } from './analysis';
import { processing } from './processing';
import { editTextDocument } from '../common/tools';
import { getExtractEdits, getReplaceEdits } from './edits';

export async function replaceWorker(
    editor: vscode.TextEditor,
    scope: vscode.Range[] | vscode.TextDocument,
    find: string,
    replace: string,
    isExtract: boolean,
    processor: (strings: string[], ...args: string[]) => Promise<IProcessReulst>,
    ...processorArgs: string[]
);
export async function replaceWorker(
    editor: vscode.TextEditor,
    scope: vscode.Range[] | vscode.TextDocument,
    find: string,
    replace: string,
    isExtract: boolean,
    func: string,
    ...processorArgs: string[]
);
export async function replaceWorker(
    editor: vscode.TextEditor,
    scope: vscode.Range[] | vscode.TextDocument,
    find: string,
    replace: string,
    isExtract: boolean,
    func: any,
    ...para: any[],
) {
    try {
        if (!find || !scope) return;
        let ranges: vscode.Range[] = scope instanceof Array ? scope : documentToRange(scope);
        if (!ranges.length) return;
        let document = editor.document;

        let confs = analysis(document, ranges, find, replace);
        let stringsSet = confs.reduce((p, c) => {
            c.findConfig.subMatchesToTransform.map(s => p.add(s));
            return p;
        }, new Set<string>([]));
        let strings = Array.from(stringsSet);
        let dict = await processing(strings, func, ...para);
        let edits = confs.reduce((p, c) => {
            p.push(
                ...((isExtract ? getExtractEdits : getReplaceEdits)(c, dict))
            );
            return p;
        }, []);
        editTextDocument(document, edits);
    } catch (error) {
        return Promise.reject(error);
    }
}

function documentToRange(document: vscode.TextDocument): vscode.Range[] {
    let first = document.lineAt(0).range;
    let last = document.lineAt(document.lineCount - 1).range;
    return [first.union(last)];
}