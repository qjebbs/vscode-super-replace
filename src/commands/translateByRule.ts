import { Command } from './command';

export class CommandTranslateByRule extends Command {
    execute() {
        console.log("Hello World!");
    }
    constructor() {
        super("translatorAdvanced.translateByRule");
    }
}