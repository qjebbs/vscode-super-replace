import { Command } from './command';
import { uiMain } from '../ui/uiMain';

export class CommandDoReplaceUI extends Command {
    async execute() {
        uiMain.show();
    }
    constructor() {
        super("superReplace.replaceWindow");
    }
}