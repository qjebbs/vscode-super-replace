import { google } from "../translators/google";

export function evalFunction(func: string) {
    return eval(func);
}

function gtranslte(source: string, target: string) {
    return async function (strings: string[]) {
        // for detection to be a array func.
        if (!strings.length) return [];
        let result = await google.translate(strings, target, source);
        // return error as non-array
        if (result.error) return result.error.message;
        return result.translations;
    }
}