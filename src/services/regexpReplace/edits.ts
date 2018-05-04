import { IAnalysisResult, IProcessedResultDict } from "./interfaces";
import { RangeReplace } from "../common/tools";
import { CalcReplace } from "./replaceConfig";

export function getExtractEdits(conf: IAnalysisResult, dict: IProcessedResultDict) {
    let extracted = conf.findConfig.collectedMatches.reduce(
        (p, lineMatches) => {
            let matches = lineMatches.matches.reduce((p, m, i) => {
                let r = CalcReplace(conf.replaceConfig, m, dict);
                return p + (r ? r + '\n' : "");
            }, "").trim();
            return p + (matches ? matches + '\n' : "");
        },
        ""
    ).trim();
    return [<RangeReplace>{ range: conf.range, replace: extracted }];
}

export function getReplaceEdits(conf: IAnalysisResult, dict: IProcessedResultDict) {
    return conf.findConfig.collectedMatches.map((lineMatches, i) => {
        if (lineMatches.restSubStrings.length - lineMatches.matches.length !== 1)
            throw new Error("查找结果子串与匹配数量不合预期！");
        let rng = lineMatches.range;
        let text = "";
        if (!lineMatches.matches.length) return undefined;
        text = lineMatches.matches.reduce((p, m, i) => {
            let rep = CalcReplace(conf.replaceConfig, m, dict);
            return p + rep + lineMatches.restSubStrings[i + 1];
        }, lineMatches.restSubStrings[0]);
        return <RangeReplace>{
            range: rng,
            replace: text,
        }
    }).filter(e => e !== undefined);
}