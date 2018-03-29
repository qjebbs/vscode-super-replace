
import * as vscode from 'vscode';
import { getReplaceConfig, CalcReplace } from './replace';
import { getFindConfig } from './find';
import { RangeReplace, editTextDocument } from '../common/tools';

export async function doReplace(find: string, replace: string,
    editor: vscode.TextEditor, processor: any, ...processorArgs: string[]) {
    let document = editor.document;
    let lines = [...new Array(document.lineCount).keys()].map((_, i) => document.lineAt(i).text);

    let replaceConfig = getReplaceConfig(replace);
    let findConfig = getFindConfig(find, lines, replaceConfig);
    let strings = findConfig.subMatchesToTransform;
    let trans = await processor(strings, ...processorArgs);
    if (!trans) return;
    if (trans.error) {
        vscode.window.showInformationMessage(trans.error.message);
        return;
    }
    let dict = trans.translatedDict;
    let edits = findConfig.collectedMatches.map((lineMatches, i) => {
        if (!lineMatches.length) return;
        let textLine = document.lineAt(i);
        let text = textLine.text;
        let rng = textLine.range;
        lineMatches.map(matches => {
            let rep = CalcReplace(replaceConfig, matches, dict);
            text = text.replace(matches[0], rep);
        });
        console.log(text);
        return <RangeReplace>{
            range: rng,
            replace: text,
        }
    })

    editTextDocument(document, edits);
}