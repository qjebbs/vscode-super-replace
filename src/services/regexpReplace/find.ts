import { ReplaceConfig, IReplaceFillType, IFindMatches } from "./interfaces";
import { IFindConfig } from "./interfaces";

export function getFindConfig(find: string, texts: string[], replaceConfig: ReplaceConfig): IFindConfig {
    let strings: string[] = [];
    //find out indexes of sub matches need to translate
    let indexes = replaceConfig.indexes.reduce((p, c) => {
        if (c.type == IReplaceFillType.translated) p.push(c.index);
        return p;
    }, <number[]>[]);
    let maxIndex = Math.max(...indexes);

    let reg = new RegExp(find, "g");
    let collectedFinds: IFindMatches[] = [];
    for (let i = 0; i < texts.length; i++) {
        let text = texts[i];
        let lineMatches: RegExpExecArray[] = [];
        let matches: RegExpExecArray;
        let subs: string[] = [];
        let pos = 0;
        while (matches = reg.exec(text)) {
            if (maxIndex > matches.length - 1) {
                throw new Error("Sub match index out of bound. Please Check your replace text!");
            }
            lineMatches.push(matches);
            // collect needed sub matched to translate
            strings.push(...indexes.map(i => matches[i]));
            subs.push(text.substr(pos, reg.lastIndex - matches[0].length - pos));
            pos = reg.lastIndex;
        }
        if (pos >= text.length) {
            subs.push("");
        } else {
            subs.push(text.substring(pos, text.length));
        }
        collectedFinds.push(<IFindMatches>{
            matches: lineMatches,
            restSubStrings: subs
        });
    }
    return <IFindConfig>{
        collectedMatches: collectedFinds,
        subMatchesToTransform: strings,
    }
}