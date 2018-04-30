import { ReplaceConfig, IReplaceIndex, IReplaceFillType, IProcessedResultDict } from "./interfaces";

export function getReplaceConfig(text: string): ReplaceConfig {
    let subs: string[] = [];
    let indexes: IReplaceIndex[] = [];
    let pos = 0;
    let stage = 0;
    for (let i = 0; i < text.length; i++) {
        let ch = text.substr(i, 1);
        let nextCh = i < text.length - 1 ? text.substr(i + 1, 1) : "";
        if (ch == '\\') {
            i++;
            continue;
        } else if (ch == "$") {
            stage++;
            continue;
        }
        if (stage == 1) {
            let n = extractNumner(text, i);
            if (n) {
                subs.push(text.substring(pos, i - 1));
                indexes.push({
                    index: Number(n),
                    type: IReplaceFillType.origin
                });
                i += n.length - 1;
                pos = i + 1;
                stage = 0;
            }
        }
        if (stage >= 2) {
            let n = extractNumner(text, i);
            if (n) {
                subs.push(text.substring(pos, i - 2));
                indexes.push({
                    index: Number(n),
                    type: IReplaceFillType.processed
                });
                i += n.length - 1;
                pos = i + 1;
                stage = 0;
            }
        }
    }
    if (pos >= text.length) {
        subs.push("");
    } else {
        subs.push(text.substring(pos, text.length));
    }
    return <ReplaceConfig>{
        indexes: indexes,
        restSubStrings: subs.map(s => escape(s))
    };
}
function escape(text: string): string {
    return text.replace("\\t", "\t")
        .replace(/\\n/g, "\n")
        .replace(/\\r/g, "\r")
        .replace(/\\(.)/g, "$1");
}
function extractNumner(text: string, from: number): string {
    let str = "";
    let maxLen = text.length - from;
    for (let i = 1; i <= maxLen; i++) {
        let s = text.substr(from, i);
        if (isNumber(s)) str = s; else break;
    }
    return str;
}
function isNumber(value: string) {
    return /^\d+$/.test(value);
}

export function CalcReplace(replace: ReplaceConfig, matches: RegExpExecArray, processedDict: IProcessedResultDict): string {
    if (replace.restSubStrings.length - replace.indexes.length !== 1) {
        let msg = "替换子串与索引数量不合预期！";
        console.log(msg);
        throw new Error(msg);
    }
    return replace.indexes.reduce((p, c, i) => {
        let fillText = "";
        let org = undefined;
        if (c.index < matches.length) {
            org = matches[c.index];
            if (org === undefined) org = "";
        }
        if (c.type == IReplaceFillType.origin) {
            fillText = org === undefined ? `$${c.index}` : org;
        } else {
            fillText = org === undefined ? `$$${c.index}` : processedDict[org];
        }
        return p + fillText + replace.restSubStrings[i + 1];
    }, replace.restSubStrings[0]);
}