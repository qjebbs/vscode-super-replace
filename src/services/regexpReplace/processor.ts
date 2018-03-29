import { evalFunction } from "./evalFunc";
import { IProcessReulst } from "./interfaces";

export async function makeProcessor(func: string): Promise<(strings: string[], ...args: string[]) => Promise<IProcessReulst>> {
    let f = evalFunction(func);
    if (!(f instanceof Function)) return Promise.resolve(f);
    let test = await f([]);
    let isArrayFunc = test instanceof Array;
    return async function (strings: string[], ...args: string[]): Promise<IProcessReulst> {
        let dict = {};
        if (!strings.length) return undefined
        let results: string[] = []
        try {
            if (isArrayFunc) {
                let r = await f(strings);
                if (!(r instanceof Array) || r.length !== strings.length) {
                    let msg = "";
                    if (r)
                        msg = r;
                    else
                        msg = "Processing function failed to run as expected!";
                    throw new Error(msg);
                }
                results = r;
            } else {
                results = strings.map(s => {
                    let result = f(s);
                    if (result instanceof Array) {
                        let msg = "";
                        if (result.length)
                            msg = result.join('\n');
                        else
                            msg = "Processing function failed to run as expected!";
                        throw new Error(msg);
                    }
                    return result;
                });
            }
        } catch (error) {
            return {
                error: {
                    code: 0,
                    message: error.toString()
                },
                processedDict: undefined,
            }
        }
        for (let i = 0; i < strings.length; i++) {
            dict[strings[i]] = results[i];
        }
        return {
            error: undefined,
            processedDict: dict,
        }
    }
}
