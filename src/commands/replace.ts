import { Command } from './command';
import { uiMain } from '../ui/uiMain';
import * as vscode from 'vscode';
import { doReplace } from '../services/regexpReplace/replace';
import { makeProcessor } from '../services/regexpReplace/processor';
import { showMessagePanel } from '../services/common/tools';

let state = {
    reportingOK: false
}

export class CommandDoReplaceUI extends Command {
    async execute() {
        uiMain.show(state);
        restartLoop();
    }
    constructor() {
        super("superReplace.replaceWindow");
    }
}

function restartLoop(idx?: number) {
    if (state.reportingOK) return;
    idx = idx ? idx : 0;
    if (idx) {
        console.log(`Time out waiting for ui report. Restart the replace window. #${idx}`);
        uiMain.reOpen(state);
    }
    setTimeout(() => {
        restartLoop(++idx);
    }, 1000);
}

export class CommandReplace extends Command {
    async execute(...args: any[]) {
        let option = args[0];
        if (option.reporting !== undefined) {
            console.log(`Recieve ui reporting #${option.reporting}. Refreshing to stop the reporting.`);
            if (!state.reportingOK) {
                state.reportingOK = true;
                uiMain.refresh(state);
            }
            return;
        }
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
