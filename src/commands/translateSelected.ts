import { Command } from './command';
import { config } from '../services/common/config';

export class CommandTranslateSelected extends Command {
    execute() {
        console.log("Hello World!");
    }
    constructor() {
        super("translatorAdvanced.translateSelect");
    }
}