'use strict';

import * as vscode from 'vscode';
import { CommandTranslateSelected } from './commands/translateSelected';
import { CommandTranslateByRule } from './commands/translateByRule';
import { config } from './services/common/config';
import { CommandDoReplace, CommandDoReplaceUI } from './commands/doReplace';
import { setContext } from './services/common/context';
import { uiMain } from '../ui/main/uiMain';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    setContext(context);
    context.subscriptions.push(
        config, uiMain,
        new CommandTranslateSelected(),
        new CommandTranslateByRule(),
        new CommandDoReplace(),
        new CommandDoReplaceUI,
    );
}

// this method is called when your extension is deactivated
export function deactivate() {
}