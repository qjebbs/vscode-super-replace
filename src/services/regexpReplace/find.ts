import { ReplaceConfig, IReplaceFillType } from "./interfaces";
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
    return <IFindConfig>{
        collectedMatches: collectedFinds,
        subMatchesToTransform: strings,
    }
}