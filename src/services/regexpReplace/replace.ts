
import * as vscode from 'vscode';
import { getReplaceConfig, CalcReplace } from './replaceConfig';
import { getFindConfig } from './findConfig';
import { RangeReplace, editTextDocument } from '../common/tools';
import { IProcessReulst, IRangeText, IProcessedResultDict, IAnalysisResult } from './interfaces';
import { makeProcessor } from './processor';

export async function doReplace(
    editor: vscode.TextEditor,
    scope: vscode.Range[] | vscode.TextDocument,
    find: string,
    replace: string,
    isExtract: boolean,
    processor: (strings: string[], ...args: string[]) => Promise<IProcessReulst>,
    ...processorArgs: string[]
);
export async function doReplace(
    editor: vscode.TextEditor,
    scope: vscode.Range[] | vscode.TextDocument,
    find: string,
    replace: string,
    isExtract: boolean,
    func: string,
    ...processorArgs: string[]
);
export async function doReplace(
    editor: vscode.TextEditor,
    scope: vscode.Range[] | vscode.TextDocument,
    find: string,
    replace: string,
    isExtract: boolean,
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
        let dict = await processMatches(strings, ...para);
        let edits = confs.reduce((p, c) => {
            p.push(
                ...getEdits(c, isExtract, dict)
            );
            return p;
        }, []);
        editTextDocument(document, edits);
    } catch (error) {
        return Promise.reject(error);
    }
}

function analysis(
    document: vscode.TextDocument,
    ranges: vscode.Range[],
    find: string,
    replace: string,
): IAnalysisResult[] {
    return ranges.map(range => {
        if (range.isEmpty) return undefined;
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
        if (!findConfig) return undefined;
        return <IAnalysisResult>{
            range: range,
            findConfig: findConfig,
            replaceConfig: replaceConfig,
        };
    }).filter(c => c !== undefined);
}

function getEdits(
    conf: IAnalysisResult,
    isExtract: boolean,
    dict: IProcessedResultDict,
) {
    let edits: RangeReplace[];
    if (isExtract) {
        let extracted = conf.findConfig.collectedMatches.reduce(
            (p, lineMatches) => {
                let matches = lineMatches.matches.reduce((p, m, i) => {
                    let r = CalcReplace(conf.replaceConfig, m, dict);
                    return p + (r ? r + '\n' : "");
                }, "").trim();
                return p + '\n' + matches;
            },
            ""
        ).trim();
        edits = [<RangeReplace>{ range: conf.range, replace: extracted }];
    } else {
        edits = conf.findConfig.collectedMatches.map((lineMatches, i) => {
            if (lineMatches.restSubStrings.length - lineMatches.matches.length !== 1)
                throw new Error("查找结果子串与匹配数量不合预期！");
            let rng = lineMatches.range;
            let text = "";
            if (!lineMatches.matches.length) return undefined;
            text = lineMatches.matches.reduce((p, m, i) => {
                let rep = CalcReplace(conf.replaceConfig, m, dict);
                return p + rep + lineMatches.restSubStrings[i + 1];
            }, lineMatches.restSubStrings[0]);
            return <RangeReplace>{
                range: rng,
                replace: text,
            }
        }).filter(e => e !== undefined);
    }
    return edits;
}

async function processMatches(strings: string[], ...para: any[]) {
    if (!strings.length) return {};
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
    return result.processedDict;

}

function documentToRange(document: vscode.TextDocument): vscode.Range[] {
    let first = document.lineAt(0).range;
    let last = document.lineAt(document.lineCount - 1).range;
    return [first.union(last)];
}