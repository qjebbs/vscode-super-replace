import { ConfigReader } from "./configReader";


class Conifg extends ConfigReader {
    constructor() {
        super('superReplace');
    }
    onChange() { }
    get googleApiKeyFile(): string {
        return this.read<string>("googleApiKeyFile");
    }

}

export const config = new Conifg();