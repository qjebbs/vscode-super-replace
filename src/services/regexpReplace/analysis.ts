import * as vscode from 'vscode';
import { IAnalysisResult, IRangeText } from './interfaces';
import { getReplaceConfig } from './replaceConfig';
import { getFindConfig } from './findConfig';

export function analysis(
    document: vscode.TextDocument,
    ranges: vscode.Range[],
    find: string,
    replace: string,
): IAnalysisResult[] {
    return ranges.map(range => {
        if (range.isEmpty) return undefined;
        let lines: IRangeText[] = [];
        for (let i = range.start.line; i <= range.end.line; i++) {
            let rng = document.lineAt(i).range.intersection(range);
            if (!rng) continue;
            lines.push(<IRangeText>{
                text: document.getText(rng),
                range: rng
            });
        }
        let replaceConfig = getReplaceConfig(replace);
        let findConfig = getFindConfig(find, lines, replaceConfig);
        if (!findConfig) return undefined;
        return <IAnalysisResult>{
            range: range,
            findConfig: findConfig,
            replaceConfig: replaceConfig,
        };
    }).filter(c => c !== undefined);
}