export interface ITranslator {
    translate(strings: string | string[], target: string, source?: string, ): Promise<ITranslation>;
}
export interface ITranslateError {
    code: number,
    message: string,
}
export interface ITranslation {
    error: ITranslateError,
    translations: string[],
}
export interface IDetectLanguageResult {
    error: ITranslateError,
    detections: string[],
}