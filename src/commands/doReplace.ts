import { Command } from './command';
import { uiMain } from '../../ui/main/uiMain';

export class CommandDoReplace extends Command {
    execute(...args: any[]) {
        console.log(args);
    }
    constructor() {
        super("translatorAdvanced.doReplace");
    }
}

export class CommandDoReplaceUI extends Command {
    async execute() {
        uiMain.show();
    }
    constructor() {
        super("translatorAdvanced.regexpReplaceExtented");
    }
}
