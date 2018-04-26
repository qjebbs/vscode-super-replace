import { Command } from './command';
import { uiMain } from '../ui/uis';
import * as vscode from 'vscode';
import { doReplace } from '../services/regexpReplace/replace';
import { makeProcessor } from '../services/regexpReplace/processor';
import { showMessagePanel } from '../services/common/tools';

let state = {};

export class CommandDoReplaceUI extends Command {
    async execute() {
        uiMain.show(state);
    }
    constructor() {
        super("superReplace.replaceWindow");
    }
}

export class CommandReplace extends Command {
    async execute(...args: any[]) {
        let option = args[0];
        // console.log(args);
        let find = option.find;
        let replace = option.replace;
        let func = option.func;
        let range = option.range;
        if (!find) vscode.window.showInformationMessage("Find pattern cannot be empty!");

        let editors = vscode.window.visibleTextEditors;
        // editors.map(e => console.log(e.document.uri.fsPath));
        let editor = editors[0];
        doReplace(editor, range ? undefined : editor.selection, find, replace, func).catch(err => {
            showMessagePanel(err)
        });
    }
    constructor() {
        super("superReplace.doReplace");
    }
}
