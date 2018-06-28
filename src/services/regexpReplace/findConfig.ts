import * as vscode from 'vscode';
import { ReplaceConfig, IReplaceFillType, IFindMatches, IRangeText } from "./interfaces";
import { IFindConfig } from "./interfaces";

export function getFindConfig(find: string, lines: IRangeText[], replaceConfig: ReplaceConfig): IFindConfig {
    if (!find) return undefined;
    let stringsSet = new Set<string>([]);
    let strings: string[] = [];
    //find out indexes of sub matches need to translate
    let indexes = replaceConfig.indexes.reduce((p, c) => {
        if (c.type == IReplaceFillType.processed) p.push(c.index);
        return p;
    }, <number[]>[]);

    let reg = new RegExp(find, "g");
    let collectedFinds: IFindMatches[] = [];
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let lineMatches: RegExpExecArray[] = [];
        let lineMatchesRange: vscode.Range[] = [];
        let matches: RegExpExecArray;
        let subs: string[] = [];
        let subsRange: vscode.Range[] = [];
        let pos = 0;
        while (matches = reg.exec(line.text)) {
            lineMatches.push(matches);
            lineMatchesRange.push(
                new vscode.Range(
                    new vscode.Position(line.range.start.line, matches.index),
                    new vscode.Position(line.range.start.line, matches.index + matches[0].length)
                )
            );
            // collect needed sub matched to translate
            indexes.map(i => stringsSet.add(matches[i]));
            // strings.push(...indexes.map(i => matches[i]));
            subs.push(line.text.substr(pos, reg.lastIndex - matches[0].length - pos));
            subsRange.push(
                new vscode.Range(
                    new vscode.Position(line.range.start.line, pos),
                    new vscode.Position(line.range.start.line, reg.lastIndex - matches[0].length)
                )
            );
            pos = reg.lastIndex;
        }
        if (pos >= line.text.length) {
            subs.push("");
            subsRange.push(
                new vscode.Range(
                    new vscode.Position(line.range.start.line, line.text.length),
                    new vscode.Position(line.range.start.line, line.text.length)
                )
            );
        } else {
            subs.push(line.text.substring(pos, line.text.length));
            subsRange.push(
                new vscode.Range(
                    new vscode.Position(line.range.start.line, pos),
                    new vscode.Position(line.range.start.line, line.text.length)
                )
            );
        }
        collectedFinds.push(<IFindMatches>{
            sourceLine: line.range,
            matches: lineMatches,
            matchRanges: lineMatchesRange,
            restSubStrings: subs,
            restSubStringRanges: subsRange
        });
    }
    // convert to array and remove undefined values from invalid sub match indexes
    strings = Array.from(stringsSet).filter(s => s !== undefined);
    return <IFindConfig>{
        collectedMatches: collectedFinds,
        subMatchesToTransform: strings,
    }
}