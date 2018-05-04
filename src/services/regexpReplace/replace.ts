
import * as vscode from 'vscode';
import { getReplaceConfig, CalcReplace } from './replaceConfig';
import { getFindConfig } from './findConfig';
import { RangeReplace, editTextDocument } from '../common/tools';
import { IProcessReulst, IRangeText, IProcessedResultDict } from './interfaces';
import { makeProcessor } from './processor';

export async function doReplace(
    editor: vscode.TextEditor,
    scope: vscode.Range | vscode.TextDocument,
    find: string,
    replace: string,
    isExtract: boolean,
    processor: (strings: string[], ...args: string[]) => Promise<IProcessReulst>,
    ...processorArgs: string[]
);
export async function doReplace(
    editor: vscode.TextEditor,
    scope: vscode.Range | vscode.TextDocument,
    find: string,
    replace: string,
    isExtract: boolean,
    func: string,
    ...processorArgs: string[]
);
export async function doReplace(
    editor: vscode.TextEditor,
    scope: vscode.Range | vscode.TextDocument,
    find: string,
    replace: string,
    isExtract: boolean,
    ...para: any[],
) {
    try {
        if (!find || !scope) return;
        let range: vscode.Range = scope instanceof vscode.Range ? scope : documentToRange(scope);
        if (range.isEmpty) return;
        let lineRanges: IRangeText[] = [];

        let document = editor.document;
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
        if (!findConfig) return;

        let strings = findConfig.subMatchesToTransform;

        let dict: IProcessedResultDict = {};
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
            let rng = lineMatches.range;
            let text = "";
            if (isExtract) {
                let lineText = document.getText(rng);
                let end: vscode.Position;
                if (rng.end.character < lineText.length)
                    end = rng.end.translate(0, 1);
                else
                    end = new vscode.Position(rng.end.line + 1, 0);
                rng = new vscode.Range(
                    rng.start,
                    end
                );
                text = lineMatches.matches.reduce((p, m, i) => {
                    let r = CalcReplace(replaceConfig, m, dict);
                    return p + (r ? r + '\n' : "");
                }, "");
            } else {
                if (!lineMatches.matches.length) return undefined;
                text = lineMatches.matches.reduce((p, m, i) => {
                    let rep = CalcReplace(replaceConfig, m, dict);
                    return p + rep + lineMatches.restSubStrings[i + 1];
                }, lineMatches.restSubStrings[0]);
            }
            return <RangeReplace>{
                range: rng,
                replace: text,
            }
        }).filter(e => e !== undefined);
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