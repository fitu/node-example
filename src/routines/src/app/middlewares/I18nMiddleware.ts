import { Application } from "express";
import i18next from "i18next";
import { LanguageDetector, handle } from "i18next-http-middleware";

import Middleware from "@shared/middlewares/Middleware";
import enBaseTranslations from "@shared/resources/locales/en/translation.json";
import enUserTranslations from "modules/routine/resources/locales/en/translation.json";
import esBaseTranslations from "@shared/resources/locales/es/translation.json";
import esUserTranslations from "modules/routine/resources/locales/es/translation.json";

const DEFAULT_LANGUAGE = "en";
const ACCEPTED_LANGUAGES = [DEFAULT_LANGUAGE, "es"];

class I18nMiddleware implements Middleware {
    public async init(app: Application): Promise<void> {
        await i18next.use(LanguageDetector).init({
            resources: {
                en: {
                    translation: {
                        ...enBaseTranslations,
                        ...enUserTranslations,
                    },
                },
                es: {
                    translation: {
                        ...esBaseTranslations,
                        ...esUserTranslations,
                    },
                },
            },
            fallbackLng: DEFAULT_LANGUAGE,
            preload: ACCEPTED_LANGUAGES,
        });

        app.use(handle(i18next));
    }
}

export default I18nMiddleware;
