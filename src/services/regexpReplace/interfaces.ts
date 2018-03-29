export interface IFindMatches {
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