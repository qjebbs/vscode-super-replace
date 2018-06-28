import * as vscode from 'vscode';

export interface IRangeText {
    range: vscode.Range;
    text: string;
}

export interface IFindMatches {
    sourceLine: vscode.Range;
    matches: RegExpExecArray[];
    matchRanges: vscode.Range[];
    restSubStrings: string[];
    restSubStringRanges: vscode.Range[];
}
export interface IFindConfig {
    collectedMatches: IFindMatches[];
    subMatchesToTransform: string[];
}
export enum IReplaceFillType {
    origin,
    processed,
}

export interface IReplaceIndex {
    index: number;
    type: IReplaceFillType;
}

export interface ReplaceConfig {
    indexes: IReplaceIndex[];
    restSubStrings: string[];
}

export interface IProcessError {
    code: number,
    message: string,
}

export type IProcessedResultDict = {
    [key: string]: string
}

export interface IProcessReulst {
    processedDict: IProcessedResultDict,
    error: IProcessError,
}

export interface IAnalysisResult {
    range: vscode.Range,
    replaceConfig: ReplaceConfig,
    findConfig: IFindConfig,
}