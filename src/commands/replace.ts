import { Command } from './command';
import { uiMain } from '../ui/uiMain';
import * as vscode from 'vscode';
import { doReplace } from '../services/regexpReplace/replace';

export class CommandDoReplaceUI extends Command {
    async execute() {
        uiMain.show();
    }
    constructor() {
        super("superReplace.replaceWindow");
    }
}