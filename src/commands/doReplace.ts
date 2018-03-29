import { Command } from './command';
import { uiMain } from '../../ui/main/uiMain';
import * as vscode from 'vscode';
import { doReplace } from '../services/regexpReplace/doReplace';
import { makeProcessor } from '../services/regexpReplace/processor';
import { showMessagePanel } from '../services/common/tools';

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
        if (!(processor instanceof Function)) {
            showMessagePanel("Your input is not a function or contains error:\n" + processor + "\n\nInput:\n" + func);
            return;
        };
        doReplace(find, replace, editors[0], processor).catch(err => {
            showMessagePanel(err)
        });
    }
    constructor() {
        super("translatorAdvanced.doReplace");
    }
}
