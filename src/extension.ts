'use strict';

import * as vscode from 'vscode';
import { config } from './services/common/config';
import { CommandReplace, CommandDoReplaceUI } from './commands/replace';
import { setContext } from './services/common/context';
import { uiMain } from '../ui/main/uiMain';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    setContext(context);
    context.subscriptions.push(
        config, uiMain,
        new CommandReplace(),
        new CommandDoReplaceUI(),
    );
}

// this method is called when your extension is deactivated
export function deactivate() {
}