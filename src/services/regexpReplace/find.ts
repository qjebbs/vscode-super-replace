import { ReplaceConfig, ReplaceFillType } from "./replace";

export interface FindConfig {
    collectedMatches: RegExpExecArray[][],
    subMatchesToTransform: string[],
}
export function getFindConfig(find: string, texts: string[], replaceConfig: ReplaceConfig): FindConfig {
    let strings: string[] = [];
    //find out indexes of sub matches need to translate
    let indexes = replaceConfig.indexes.reduce((p, c) => {
        if (c.type == ReplaceFillType.translated) p.push(c.index);
        return p;
    }, <number[]>[]);
    let maxIndex = Math.max(...indexes);

    let reg = new RegExp(find, "g");
    let collectedFinds: RegExpExecArray[][] = [];
    for (let i = 0; i < texts.length; i++) {
        let finds: RegExpExecArray[] = [];
        let text = texts[i];
        let matches: RegExpExecArray;
        while (matches = reg.exec(text)) {
            finds.push(matches);
            if (maxIndex > matches.length - 1) {
                throw new Error("Sub match index out of bound. Please Check your replace text!");
            }
            // collect needed sub matched to translate
            strings.push(...indexes.map(i => matches[i]));
        }
        collectedFinds.push(finds);
    }
    return <FindConfig>{
        collectedMatches: collectedFinds,
        subMatchesToTransform: strings,
    }
}