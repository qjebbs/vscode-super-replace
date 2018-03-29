import { Command } from './command';
import { uiMain } from '../../ui/main/uiMain';
import * as vscode from 'vscode';
import { doReplace } from '../services/regexpReplace/doReplace';
import { IProcessReulst } from '../services/regexpReplace/interfaces';

export class CommandDoReplaceUI extends Command {
    async execute() {
        uiMain.show();
    }
    constructor() {
        super("translatorAdvanced.regexpReplaceExtented");
    }
}

export class CommandDoReplace extends Command {
    execute(...args: any[]) {
        console.log(args);
        let find = args[0].find;
        let replace = args[0].replace;
        let func = args[0].func;

        let editors = vscode.window.visibleTextEditors;

        doReplace(find, replace, editors[0], makeProcessor(func))
    }
    constructor() {
        super("translatorAdvanced.doReplace");
    }
}
function makeProcessor(func: string): (strings: string[], ...args: string[]) => Promise<IProcessReulst> {
    let f = eval(func);
    return async function (strings: string[], ...args: string[]): Promise<IProcessReulst> {
        let dict = {};
        if (!strings.length) return undefined
        let results: string[] = []
        try {
            results = strings.map(s => f(s));
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