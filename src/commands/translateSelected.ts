import { Command } from './command';
import { config } from '../services/common/config';
import * as vscode from 'vscode';
import { google } from '../services/translators/google';
import { editTextDocument, RangeReplace } from '../services/common/tools';

export class CommandTranslateSelected extends Command {
    async execute() {
        let editor = vscode.window.activeTextEditor;
        let selection = editor.selection;
        let text = editor.document.getText(selection).trim();
        if (!text) {
            vscode.window.showInformationMessage("Please select the table area first.");
            return;
        }
        let result = await google.translate([text], "zh-cn");
        if (result.error) {
            vscode.window.showInformationMessage(result.error.message);
            return;
        }
        editTextDocument(
            editor.document,
            [
                <RangeReplace>{
                    range: editor.selection,
                    replace: result.translations[0]
                }
            ]
        );
    }
    constructor() {
        super("translatorAdvanced.translateSelect");
    }
}