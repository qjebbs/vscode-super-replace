import { ConfigReader } from "./configReader";


class Conifg extends ConfigReader {
    constructor() {
        super('superReplace');
    }
    onChange() { }
    get googleApiKey(): string {
        return this.read<string>("googleApiKey");
    }

}

export const config = new Conifg();