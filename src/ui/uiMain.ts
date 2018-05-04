import { UI } from "./ui";
import * as vscode from 'vscode';
import { contextManager } from '../services/common/context';
import { superReplace } from "../services/regexpReplace/replace";
import { superExtract } from "../services/regexpReplace/extract";

export var uiMain: UI;

contextManager.addInitiatedListener(ctx => {
    uiMain = new UI(
        "superReplace.main",
        "Super Replace",
        ctx.asAbsolutePath("assets/ui/main/index.htm"),
        replace,
    );
});

interface ReplaceOption {
    find: string,
    replace: string,
    func: string,
    isExtract: boolean,
}

async function replace(option: ReplaceOption) {
    if (!option.find) {
        vscode.window.showInformationMessage("Find pattern cannot be empty!");
        return;
    }
    let editors = vscode.window.visibleTextEditors;
    let editor = editors[0];
    let hasSelection = editor.selections.reduce((p, s) => {
        return p || !s.isEmpty;
    }, false);

    let worker = option.isExtract ? superExtract : superReplace;

    await worker(
        editor,
        hasSelection ? editor.selections : editor.document,
        option.find,
        option.replace,
        option.func
    );
}