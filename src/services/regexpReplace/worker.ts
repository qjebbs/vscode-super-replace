
import * as vscode from 'vscode';
import { IProcessReulst } from './interfaces';
import { analysis } from './analysis';
import { processing } from './processing';
import { editTextDocument } from '../common/tools';

export async function replaceWorker(
    editor: vscode.TextEditor,
    scope: vscode.Range[] | vscode.TextDocument,
    find: string,
    replace: string,
    handle: any,
    processor: (strings: string[], ...args: string[]) => Promise<IProcessReulst>,
    ...processorArgs: string[]
);
export async function replaceWorker(
    editor: vscode.TextEditor,
    scope: vscode.Range[] | vscode.TextDocument,
    find: string,
    replace: string,
    handle: any,
    func: string,
    ...processorArgs: string[]
);
export async function replaceWorker(
    editor: vscode.TextEditor,
    scope: vscode.Range[] | vscode.TextDocument,
    find: string,
    replace: string,
    handle: any,
    func: any,
    ...para: any[]
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
            p.push(...(handle(c, dict)));
            return p;
        }, []);
        editTextDocument(document, edits);
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function matcheWorker(
    editor: vscode.TextEditor,
    scope: vscode.Range[] | vscode.TextDocument,
    find: string
) {
    try {
        if (!find || !scope) return;
        let ranges: vscode.Range[] = scope instanceof Array ? scope : documentToRange(scope);
        if (!ranges.length) return;
        let document = editor.document;

        let selections = [];
        let confs = analysis(document, ranges, find, "");
        confs.forEach(function (conf) {
            conf.findConfig.collectedMatches.forEach(item => {
                if (item.matches.length)
                    selections.push(
                        ...item.matchRanges.map(
                            r => new vscode.Selection(r.start, r.end)
                        )
                    );
            });
        });

        editor = await vscode.window.showTextDocument(document);
        editor.selections = selections;
    } catch (error) {
        return Promise.reject(error);
    }
}


function documentToRange(document: vscode.TextDocument): vscode.Range[] {
    let first = document.lineAt(0).range;
    let last = document.lineAt(document.lineCount - 1).range;
    return [first.union(last)];
}