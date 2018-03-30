
import * as vscode from 'vscode';
import { getReplaceConfig, CalcReplace } from './replaceConfig';
import { getFindConfig } from './findConfig';
import { RangeReplace, editTextDocument } from '../common/tools';
import { IProcessReulst, IRangeText } from './interfaces';
import { makeProcessor } from './processor';

export async function doReplace(
    editor: vscode.TextEditor,
    range: vscode.Range,
    find: string,
    replace: string,
    processor: (strings: string[], ...args: string[]) => Promise<IProcessReulst>,
    ...processorArgs: string[]
);
export async function doReplace(
    editor: vscode.TextEditor,
    range: vscode.Range,
    find: string,
    replace: string,
    func: string,
    ...processorArgs: string[]
);
export async function doReplace(
    editor: vscode.TextEditor,
    range: vscode.Range,
    find: string,
    replace: string,
    ...para: any[],
) {
    try {
        let document = editor.document;
        if (!range) range = documentToRange(document);
        if (range.isEmpty) return;
        let lineRanges: IRangeText[] = [];

        for (let i = range.start.line; i <= range.end.line; i++) {
            let rng = document.lineAt(i).range.intersection(range);
            if (!rng) continue;
            lineRanges.push(<IRangeText>{
                text: document.getText(rng),
                range: rng
            });
        }

        let replaceConfig = getReplaceConfig(replace);
        let findConfig = getFindConfig(find, lineRanges, replaceConfig);

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
            // let text = textLine.text;
            let rng = lineMatches.range;
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
function documentToRange(document: vscode.TextDocument): vscode.Range {
    let first = document.lineAt(0).range;
    let last = document.lineAt(document.lineCount - 1).range;
    return first.union(last);
}