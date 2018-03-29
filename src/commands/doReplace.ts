import { Command } from './command';
import { uiMain } from '../../ui/main/uiMain';
import * as vscode from 'vscode';
import { doReplace } from '../services/regexpReplace/doReplace';
import { makeProcessor } from '../services/regexpReplace/processor';

export class CommandDoReplaceUI extends Command {
    async execute() {
        uiMain.show();
    }
    constructor() {
        super("translatorAdvanced.regexpReplaceExtented");
    }
}

export class CommandDoReplace extends Command {
    async execute(...args: any[]) {
        console.log(args);
        let find = args[0].find;
        let replace = args[0].replace;
        let func = args[0].func;

        let editors = vscode.window.visibleTextEditors;

        let processor = await makeProcessor(func);
        doReplace(find, replace, editors[0], processor).catch(err => {
            let msg = "";
            if (err instanceof Error) {
                msg = err.message;
            } else {
                msg = err.toString();
            }
            vscode.window.showErrorMessage(msg);
        });
    }
    constructor() {
        super("translatorAdvanced.doReplace");
    }
}
