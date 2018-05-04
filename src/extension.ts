'use strict';

import * as vscode from 'vscode';
import { config } from './services/common/config';
import { CommandDoReplaceUI } from './commands/replace';
import { contextManager } from './services/common/context';
import { uiMain } from './ui/uiMain';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    contextManager.set(context);
    context.subscriptions.push(
        config, uiMain,
        new CommandDoReplaceUI(),
    );
}

// this method is called when your extension is deactivated
export function deactivate() {
}