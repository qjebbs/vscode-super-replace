
import * as vscode from 'vscode';
import { getReplaceConfig, CalcReplace } from './replace';
import { getFindConfig } from './find';
import { RangeReplace, editTextDocument } from '../common/tools';
import { IProcessReulst } from './interfaces';

export async function doReplace(
    find: string,
    replace: string,
    editor: vscode.TextEditor,
    processor: (strings: string[], ...args: string[]) => Promise<IProcessReulst>,
    ...processorArgs: string[]
) {
    try {
        let document = editor.document;
        let lines = [...new Array(document.lineCount).keys()].map((_, i) => document.lineAt(i).text);

        let replaceConfig = getReplaceConfig(replace);
        let findConfig = getFindConfig(find, lines, replaceConfig);

        let strings = findConfig.subMatchesToTransform;
        if (!strings.length) return;
        let trans = await processor(strings, ...processorArgs);
        if (!trans) return;
        if (trans.error) {
            return Promise.reject(trans.error.message);
        }
        let dict = trans.processedDict;
        let edits = findConfig.collectedMatches.map((lineMatches, i) => {
            if (lineMatches.restSubStrings.length - lineMatches.matches.length !== 1)
                throw new Error("查找结果子串与匹配数量不合预期！");
            if (!lineMatches.matches.length) return undefined;
            let textLine = document.lineAt(i);
            // let text = textLine.text;
            let rng = textLine.range;
            let text = lineMatches.matches.reduce((p, m, i) => {
                let rep = CalcReplace(replaceConfig, m, dict);
                return p + rep + lineMatches.restSubStrings[i + 1];
            }, lineMatches.restSubStrings[0]);

            return <RangeReplace>{
                range: rng,
                replace: text,
            }
        })
        editTextDocument(document, edits);
    } catch (error) {
        return Promise.reject(error);
    }

}