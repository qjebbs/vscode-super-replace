
import * as vscode from 'vscode';
import { getReplaceConfig, CalcReplace } from './replace';
import { getFindConfig } from './find';
import { RangeReplace, editTextDocument } from '../common/tools';
import { IProcessReulst } from './interfaces';
import { makeProcessor } from './processor';

export async function doReplace(
    editor: vscode.TextEditor,
    find: string,
    replace: string,
    processor: (strings: string[], ...args: string[]) => Promise<IProcessReulst>,
    ...processorArgs: string[]
);
export async function doReplace(
    editor: vscode.TextEditor,
    find: string,
    replace: string,
    func: string,
    ...processorArgs: string[]
);
export async function doReplace(
    editor: vscode.TextEditor,
    find: string,
    replace: string,
    ...para: any[],
) {
    try {
        let document = editor.document;
        let lines = [...new Array(document.lineCount).keys()].map((_, i) => document.lineAt(i).text);

        let replaceConfig = getReplaceConfig(replace);
        let findConfig = getFindConfig(find, lines, replaceConfig);

        let strings = findConfig.subMatchesToTransform;

        let dict = {};
        if (strings.length) {
            let processor: (strings: string[], ...args: string[]) => Promise<IProcessReulst>;
            let processorArgs: string[];
            if (para[0] instanceof Function) {
                processor = para.shift();
                processorArgs = para;
            } else {
                let func = para.shift();
                processorArgs = para;
                processor = await makeProcessor(func);
                if (!(processor instanceof Function)) {
                    return Promise.reject(
                        "Your input is not a function or contains error:\n" +
                        processor +
                        "\n\nInput:\n" +
                        func
                    );
                };
            }
            let result = await processor(strings, ...processorArgs);
            if (!result) return;
            if (result.error) {
                return Promise.reject(result.error.message);
            }
            dict = result.processedDict;
        }
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
