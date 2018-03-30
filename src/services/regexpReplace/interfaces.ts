import * as vscode from 'vscode';

export interface IRangeText {
    range: vscode.Range;
    text: string;
}

export interface IFindMatches {
    range: vscode.Range;
    matches: RegExpExecArray[];
    restSubStrings: string[];
}
export interface IFindConfig {
    collectedMatches: IFindMatches[];
    subMatchesToTransform: string[];
}
export enum IReplaceFillType {
    origin,
    translated,
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

export interface IProcessReulst {
    processedDict: any,
    error: IProcessError,
}