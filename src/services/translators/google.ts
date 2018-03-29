import * as gt from "google-translate";
import { ITranslator, ITranslation, IDetectLanguageResult, ITranslateError } from "./interface";
import { config } from "../common/config";

class googleTranslator implements ITranslator {
    private _translate = gt(config.googleApiKey);
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
            this._translate.translate(strings, source, target, (err, translation) => {
                resolve(<ITranslation>{
                    error: this.parseError(err),
                    translations: (translation instanceof Array ? translation : [translation]).map(t => t.translatedText),
                });
            });
        });
    }
    detectLanguage(strings: string | string[]): Promise<IDetectLanguageResult> {
        return new Promise<IDetectLanguageResult>((resolve, reject) => {
            this._translate.detectLanguage(strings, (err, detections) => {
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
            e = JSON.parse(err.body);
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
