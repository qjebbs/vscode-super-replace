import { ConfigReader } from "./configReader";


class Conifg extends ConfigReader {
    constructor() {
        super('superReplace');
    }
    get googleApiKey(): string {
        return this.read<string>("googleApiKey");
    }

}

export const config = new Conifg();