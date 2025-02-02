const { Translate } = require('@google-cloud/translate').v2;
require('dotenv').config();
const fs = require('fs');

const credentials = JSON.parse(fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS));
const translate = new Translate({ credentials });

const targetLanguages = [
    'en', 'zh', 'hi', 'es', 'ar', // Tier 1
    'fr', 'bn', 'pt', 'ru', 'ur', // Tier 2
    'ja', 'de', 'tr', 'ko', 'sw'  // Tier 3
];

async function translateText(text, targetLang) {
    try {
        const [translation] = await translate.translate(text, targetLang);
        console.log(`Text (${targetLang}): ${translation}`);
        return translation;
    } catch (error) {
        console.error(`Error translating to ${targetLang}:`, error);
        return null;
    }
}

async function translateToSelectedLanguages(text) {
    let translations = {};
    for (const lang of targetLanguages) {
        const translatedText = await translateText(text, lang);
        translations[lang] = translatedText;
    }
    return translations;
}

module.exports = { translateToSelectedLanguages };