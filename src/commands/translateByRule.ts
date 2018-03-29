import { Command } from './command';
import * as vscode from 'vscode';
import { google } from '../services/translators/google';
import { editTextDocument, RangeReplace } from '../services/common/tools';
import { getReplaceConfig, ReplaceFillType, CalcReplace } from '../services/regexpReplace/replace';
import { getFindConfig } from '../services/regexpReplace/find';
import { ITranslateError } from '../services/translators/interface';


export class CommandTranslateByRule extends Command {
    async execute() {
        // let find = /\S.+$/.source;// "\S.+$";
        // let replace = "$$0\t$0";

        let find = await vscode.window.showInputBox(<vscode.InputBoxOptions>{
            prompt: "Input find REGEXP:"
        })
        let replace = await vscode.window.showInputBox(<vscode.InputBoxOptions>{
            prompt: "Input replace text:"
        })
        if (!find || !replace) return;

        let editor = vscode.window.activeTextEditor;
        let document = editor.document;
        let lines = [...new Array(document.lineCount).keys()].map((_, i) => document.lineAt(i).text);

        let replaceConfig = getReplaceConfig(replace);
        let findConfig = getFindConfig(find, lines, replaceConfig);
        let strings = findConfig.subMatchesToTransform;
        let trans = await translate(strings, "zh-cn", "en");
        if (!trans) return;
        if (trans.error) {
            vscode.window.showInformationMessage(trans.error.message);
            return;
        }
        let dict = trans.translatedDict;
        let edits = findConfig.collectedMatches.map((lineMatches, i) => {
            if (!lineMatches.length) return;
            let textLine = document.lineAt(i);
            let text = textLine.text;
            let rng = textLine.range;
            lineMatches.map(matches => {
                let rep = CalcReplace(replaceConfig, matches, dict);
                text = text.replace(matches[0], rep);
            });
            console.log(text);
            return <RangeReplace>{
                range: rng,
                replace: text,
            }
        })

        editTextDocument(document, edits);
    }
    constructor() {
        super("translatorAdvanced.translateByRule");
    }
}
interface TranslateResult {
    translatedDict: any,
    error: ITranslateError,
}
async function translate(strings: string[], source: string, target: string): Promise<TranslateResult> {
    let dict = {};
    if (!strings.length) return undefined

    let result = await google.translate(strings, "zh-cn", "en");

    if (result.error)
        return {
            error: result.error,
            translatedDict: undefined,
        }

    for (let i = 0; i < strings.length; i++) {
        dict[strings[i]] = result.translations[i];
    }
    return {
        error: undefined,
        translatedDict: dict,
    }
}