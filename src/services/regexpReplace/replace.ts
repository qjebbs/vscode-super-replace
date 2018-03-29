export enum ReplaceFillType {
    origin,
    translated,
}

interface ReplaceIndex {
    index: number;
    type: ReplaceFillType;
}

export interface ReplaceConfig {
    indexes: ReplaceIndex[];
    restSubStrings: string[];
}

export function getReplaceConfig(text: string): ReplaceConfig {
    let subs: string[] = [];
    let indexes: ReplaceIndex[] = [];
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
                    type: ReplaceFillType.origin
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
                    type: ReplaceFillType.translated
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
function isNumber(value: any) {
    return /^\d+$/.test(value.toString());
}

export function CalcReplace(replace: ReplaceConfig, matches: RegExpExecArray, translatedDict: any): string {
    if (replace.restSubStrings.length - replace.indexes.length !== 1)
        throw new Error("子串与索引数量不合预期！");
    return replace.indexes.reduce((p, c, i) => {
        let fillText = "";
        if (c.type == ReplaceFillType.origin) {
            fillText = matches[c.index];
        } else {
            fillText = translatedDict[matches[c.index]];
        }
        return p + fillText + replace.restSubStrings[i + 1];
    }, replace.restSubStrings[0]);
}