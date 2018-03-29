import * as gt from "google-translate";
import { ITranslator, ITranslation, IDetectLanguageResult, ITranslateError } from "./interface";
import { config } from "../common/config";

class googleTranslator implements ITranslator {
    get translator() {
        return gt(config.googleApiKey);
    }
    async translate(strings: string | string[], target: string, source?: string): Promise<ITranslation> {
        let detec: IDetectLanguageResult;
        if (!source) {
            detec = await this.detectLanguage(strings[0]);
            if (detec.error) return Promise.resolve(<ITranslation>{
                error: detec.error,
                translations: undefined,
            });
            source = detec.detections[0];
        }
        return new Promise<ITranslation>((resolve, reject) => {
            this.translator.translate(strings, source, target, (err, translation) => {
                let translations: string[] = undefined;
                if (translation)
                    translations = (translation instanceof Array ? translation : [translation]).map(t => t.translatedText)
                resolve(<ITranslation>{
                    error: this.parseError(err),
                    translations: translations,
                });
            });
        });
    }
    detectLanguage(strings: string | string[]): Promise<IDetectLanguageResult> {
        return new Promise<IDetectLanguageResult>((resolve, reject) => {
            this.translator.detectLanguage(strings, (err, detections) => {
                resolve(<IDetectLanguageResult>{
                    error: this.parseError(err),
                    detections: (detections instanceof Array ? detections : [detections]).map(d => d.language),
                });
            });
        });
    }
    private parseError(err: any): ITranslateError {
        if (!err) return undefined;
        let e;
        if (err.body) {
            let tmp = JSON.parse(err.body);
            e = {
                code: tmp.error.code,
                message: tmp.error.message
            }
        } else if (err.error) {
            e = err.error;
        } else {
            e = {
                code: "0",
                message: "Unknow Error."
            }
        }
        return <ITranslateError>{
            code: e.code,
            message: e.message,
        }
    }
}

export var google = new googleTranslator();
