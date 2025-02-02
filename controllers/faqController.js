const faq = require('../models/faq.model');
const Redis = require('ioredis');

const redis = new Redis();

const FAQ_CACHE_KEY = 'faqs';

exports.faq = async (req, res) => {
    try {
        let faqs;
        const cachedFaqs = await redis.get(FAQ_CACHE_KEY);

        if (cachedFaqs) {
            faqs = JSON.parse(cachedFaqs);
        } else {
            const faqsObj = await faq.find();
            faqs = faqsObj.map(f => f.toObject());
            await redis.set(FAQ_CACHE_KEY, JSON.stringify(faqs), 'EX', 60);
        }

        res.render('home', { faqs });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.dashboard = async (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/login');
    
    try {
        let faqs;
        const cachedFaqs = await redis.get(FAQ_CACHE_KEY);

        if (cachedFaqs) {
            faqs = JSON.parse(cachedFaqs);
        } else {
            const faqsObj = await faq.find();
            faqs = faqsObj.map(f => f.toObject());
            await redis.set(FAQ_CACHE_KEY, JSON.stringify(faqs), 'EX', 60);
        }

        res.render('dashboard', { faqs, user: req.user });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.addFAQ = async (req, res) => {
    try {
        const { question, answer } = req.body;
        const newFAQ = new faq({ question, answer, languageMap: { en: { question, answer } } });
        await newFAQ.save();
        
        await redis.del(FAQ_CACHE_KEY);

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
