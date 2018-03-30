import { Command } from './command';
import * as vscode from 'vscode';
import { google } from '../services/translators/google';
import { doReplace } from '../services/regexpReplace/doReplace';
import { IProcessError, IProcessReulst } from '../services/regexpReplace/interfaces';
import { uiMain } from '../../ui/main/uiMain';


export class CommandTranslateByRule extends Command {
    async execute() {
        let find = await vscode.window.showInputBox(<vscode.InputBoxOptions>{
            prompt: "Input find REGEXP:"
        })
        let replace = await vscode.window.showInputBox(<vscode.InputBoxOptions>{
            prompt: "Input replace text:"
        })
        if (!find || !replace) return;

        let editor = vscode.window.activeTextEditor;
        doReplace(editor, find, replace, translate, "en", "zh-cn")
    }
    constructor() {
        super("translatorAdvanced.translateByRule");
    }
}

async function translate(strings: string[], source: string, target: string): Promise<IProcessReulst> {
    let dict = {};
    if (!strings.length) return undefined

    let result = await google.translate(strings, target, source);

    if (result.error)
        return {
            error: {
                code: result.error.code,
                message: result.error.message
            },
            processedDict: undefined,
        }

    for (let i = 0; i < strings.length; i++) {
        dict[strings[i]] = result.translations[i];
    }
    return {
        error: undefined,
        processedDict: dict,
    }
}