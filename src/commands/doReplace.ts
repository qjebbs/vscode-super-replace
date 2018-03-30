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

        doReplace(editors[0], find, replace, func).catch(err => {
            showMessagePanel(err)
        });
    }
    constructor() {
        super("translatorAdvanced.doReplace");
    }
}
