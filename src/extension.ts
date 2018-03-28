'use strict';

import * as vscode from 'vscode';
import { CommandTranslateSelected } from './commands/translateSelected';
import { CommandTranslateByRule } from './commands/translateByRule';
import { config } from './services/common/config';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        config,
        new CommandTranslateSelected(),
        new CommandTranslateByRule()
    );
}

// this method is called when your extension is deactivated
export function deactivate() {
}