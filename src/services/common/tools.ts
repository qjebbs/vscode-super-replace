import * as vscode from 'vscode';

let outputPanel = vscode.window.createOutputChannel("SuperReplace");

export function parseError(error: any): string {
    if (typeof (error) === "string") {
        return error;
    } else if (error instanceof TypeError || error instanceof Error) {
        let err = error as TypeError;
        return err.message + '\n' + err.stack;
    } else if (error instanceof Array) {
        let arrs = error as any[];
        return arrs.reduce((p, err) => p + '\n\n' + err.message + '\n' + err.stack, "");
    } else {
        return error.toString();
    }
}

export function showMessagePanel(message: any) {
    outputPanel.clear();
    outputPanel.appendLine(parseError(message));
    outputPanel.show();
}

export interface RangeReplace {
    range: vscode.Range,
    replace: string,
}

export async function editTextDocument(document: vscode.TextDocument, edits: RangeReplace[]) {
    let editor = await vscode.window.showTextDocument(document);
    editor.edit(e => {
        edits.map(edit => {
            if (!edit || !edit.range || edit.replace === undefined) return;
            e.replace(edit.range, edit.replace);
        })
    })
}