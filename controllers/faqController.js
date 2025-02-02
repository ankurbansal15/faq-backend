const faq = require('../models/faq.model');
const Redis = require('ioredis');
const { translateToSelectedLanguages } = require('../config/translateService');

const redis = new Redis();
const FAQ_CACHE_KEY = 'faqs';

exports.faq = async (req, res) => {
    console.log(req.query.lang);
    try {
        const lang = req.query.lang || 'en';
        console.log(lang);
        const cacheKey = `${FAQ_CACHE_KEY}:${lang}`;

        let faqs;
        const cachedFaqs = await redis.get(cacheKey);

        if (cachedFaqs) {
            faqs = JSON.parse(cachedFaqs);
        } else {
            const faqsObj = await faq.find();
            faqs = faqsObj.map(f => ({
                _id: f._id,
                question: f.languageMap.get(lang)?.question || f.question,
                answer: f.languageMap.get(lang)?.answer || f.answer
            }));

            await redis.set(cacheKey, JSON.stringify(faqs), 'EX', 600);
        }

        res.render('home', { faqs });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.dashboard = async (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/login');

    try {
        const lang = req.query.lang || 'en';
        const cacheKey = `${FAQ_CACHE_KEY}:${lang}`;

        let faqs;
        const cachedFaqs = await redis.get(cacheKey);

        if (cachedFaqs) {
            faqs = JSON.parse(cachedFaqs);
        } else {
            const faqsObj = await faq.find();
            faqs = faqsObj.map(f => ({
                _id: f._id,
                question: f.languageMap.get(lang)?.question || f.question,
                answer: f.languageMap.get(lang)?.answer || f.answer
            }));

            await redis.set(cacheKey, JSON.stringify(faqs), 'EX', 600);
        }

        res.render('dashboard', { faqs, user: req.user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.addFAQ = async (req, res) => {
    try {
        const { question, answer } = req.body;

        const translatedQuestions = await translateToSelectedLanguages(question);
        const translatedAnswers = await translateToSelectedLanguages(answer);
        

        let languageMap = {};
        for (const langCode in translatedQuestions) {
            languageMap[langCode] = {
                question: translatedQuestions[langCode],
                answer: translatedAnswers[langCode]
            };
        }

        const newFAQ = new faq({ question, answer, languageMap });
        await newFAQ.save();

        await redis.del(FAQ_CACHE_KEY);

        res.json({ success: true, faq: newFAQ });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
