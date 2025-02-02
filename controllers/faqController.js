const faq = require('../models/faq.model');
const express = require('express');
const router = express.Router();
router.use(express.json());

exports.faq = async (req, res) => {
    const faqsObj = await faq.find();
    const faqs = faqsObj.map(faqsObj => faqsObj.toObject());
    res.render('home', { faqs });
};
exports.dashboard = async (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/login');
    const { user } = req;
    const faqsObj = await faq.find();
    const faqs = faqsObj.map(faqsObj => faqsObj.toObject());
    res.render('dashboard', { faqs, user });
};
exports.addFAQ = (req, res) => {
    const { question, answer } = req.body;
    console.log(answer);
    const newFAQ = new faq({ question, answer, languageMap: { en: { question, answer } } });
    newFAQ.save();
    res.json({ success: true });
};