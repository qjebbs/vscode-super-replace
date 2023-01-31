import * as gt from "@google-cloud/translate";
import { ITranslator, ITranslation, IDetectLanguageResult, ITranslateError } from "./interface";
import { config } from "../common/config";

class googleTranslator implements ITranslator {
    private translator: gt.v3.TranslationServiceClient;
    private parent: string;
    constructor() {
        this.translator = new gt.v3.TranslationServiceClient({
            keyFile: config.googleApiKeyFile,
        });
    }
    async translate(contents: string | string[], target: string, source?: string): Promise<ITranslation> {
        let contentArr: string[] = contents instanceof Array ? contents : [contents];
        let detec: IDetectLanguageResult;
        if (!source) {
            detec = await this.detectLanguage(contents[0]);
            if (detec.error) return Promise.resolve(<ITranslation>{
                error: detec.error,
                translations: undefined,
            });
            source = detec.detections[0];
        }
        if (!this.parent) {
            let project = await this.translator.getProjectId();
            this.parent = `projects/${project}`;
        }
        return new Promise<ITranslation>((resolve, reject) => {
            this.translator.translateText({
                contents: contentArr,
                mimeType: "text/plain",
                sourceLanguageCode: source,
                targetLanguageCode: target,
                parent: this.parent,
            }).then(responses => {
                let translations = responses[0].translations;
                if (translations && translations.length) {
                    resolve(<ITranslation>{
                        error: undefined,
                        translations: translations.map(t => t.translatedText),
                    });
                }
            }).catch(err => {
                resolve(<ITranslation>{
                    error: err,
                    translations: undefined,
                });
            });
        });
    }
    detectLanguage(contents: string | string[]): Promise<IDetectLanguageResult> {
        let contentArr: string[] = contents instanceof Array ? contents : [contents];
        return new Promise<IDetectLanguageResult>((resolve, reject) => {
            this.translator.detectLanguage({
                content: contentArr.join(" "),
            }).then(responses => {
                let detections = responses[0].languages;
                if (detections && detections.length) {
                    resolve(<IDetectLanguageResult>{
                        error: undefined,
                        detections: detections.map(d => d.languageCode),
                    });
                }
            }).catch(err => {
                resolve(<IDetectLanguageResult>{
                    error: err,
                    detections: undefined,
                });
            });
        });
    }
}

export var google = new googleTranslator();
