import { ConfigReader } from "./configReader";


class Conifg extends ConfigReader {
    constructor(name: string) {
        super(name);
    }
    get googleApiKey(): string {
        return this.read<string>("googleApiKey");
    }

}

export const config = new Conifg('superReplace');