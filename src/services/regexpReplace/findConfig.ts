import { ReplaceConfig, IReplaceFillType, IFindMatches, IRangeText } from "./interfaces";
import { IFindConfig } from "./interfaces";

export function getFindConfig(find: string, rangTexts: IRangeText[], replaceConfig: ReplaceConfig): IFindConfig {
    if (!find) return undefined;
    let stringsSet = new Set<string>([]);
    let strings: string[] = [];
    //find out indexes of sub matches need to translate
    let indexes = replaceConfig.indexes.reduce((p, c) => {
        if (c.type == IReplaceFillType.processed) p.push(c.index);
        return p;
    }, <number[]>[]);

    let reg = new RegExp(find, "g");
    let collectedFinds: IFindMatches[] = [];
    for (let i = 0; i < rangTexts.length; i++) {
        let rngText = rangTexts[i];
        let lineMatches: RegExpExecArray[] = [];
        let matches: RegExpExecArray;
        let subs: string[] = [];
        let pos = 0;
        while (matches = reg.exec(rngText.text)) {
            lineMatches.push(matches);
            // collect needed sub matched to translate
            indexes.map(i => stringsSet.add(matches[i]));
            // strings.push(...indexes.map(i => matches[i]));
            subs.push(rngText.text.substr(pos, reg.lastIndex - matches[0].length - pos));
            pos = reg.lastIndex;
        }
        if (pos >= rngText.text.length) {
            subs.push("");
        } else {
            subs.push(rngText.text.substring(pos, rngText.text.length));
        }
        collectedFinds.push(<IFindMatches>{
            range: rngText.range,
            matches: lineMatches,
            restSubStrings: subs
        });
    }
    // convert to array and remove undefined values from invalid sub match indexes
    strings = Array.from(stringsSet).filter(s => s !== undefined);
    return <IFindConfig>{
        collectedMatches: collectedFinds,
        subMatchesToTransform: strings,
    }
}