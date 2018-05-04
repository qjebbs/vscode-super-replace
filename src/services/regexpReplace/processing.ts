import { IProcessReulst } from "./interfaces";
import { makeProcessor } from "./processor";

export async function processing(strings: string[], func: any, ...para: any[]) {
    if (!strings.length) return {};
    let processor: (strings: string[], ...args: string[]) => Promise<IProcessReulst>;
    if (func instanceof Function) {
        processor = func;
    } else {
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
    let result = await processor(strings, ...para);
    if (!result) return;
    if (result.error) {
        return Promise.reject(result.error.message);
    }
    return result.processedDict;

}