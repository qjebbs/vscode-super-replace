import { UI } from "./ui";
import * as vscode from 'vscode';
import { contextManager } from '../services/common/context';
import { superMatch } from "../services/regexpReplace/match";
import { superReplace } from "../services/regexpReplace/replace";
import { superExtract } from "../services/regexpReplace/extract";

export var uiMain: UI;

contextManager.addInitiatedListener(ctx => {
    uiMain = new UI(
        "superReplace.main",
        "Super Replace",
        ctx,
        replace,
    );
});

enum OperMode {
    Match = 0,
    Replace,
    Extract,
}

interface ReplaceOption {
    find: string,
    replace: string,
    func: string,
    mode: OperMode,
}

async function replace(option: ReplaceOption) {
    if (!option.find) {
        vscode.window.showInformationMessage("Find pattern cannot be empty!");
        return;
    }
    let editor = vscode.window.visibleTextEditors.reduce(
        (p, c) => {
            return p || (c.document.uri.scheme != "output" ? c : undefined);
        },
        undefined
    );
    if (!editor) {
        vscode.window.showInformationMessage("No active document found!");
        return;
    }
    let hasSelection = editor.selections.reduce((p, s) => {
        return p || !s.isEmpty;
    }, false);

    let worker = null;
    if (option.mode === OperMode.Match) {
        worker = superMatch;
    } else if (option.mode === OperMode.Replace) {
        worker = superReplace;
    } else if (option.mode === OperMode.Extract) {
        worker = superExtract;
    }

    await worker(
        editor,
        hasSelection ? editor.selections : editor.document,
        option.find,
        option.replace,
        option.func
    );
}