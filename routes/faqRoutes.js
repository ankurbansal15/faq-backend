const express = require('express');
const { faq, dashboard,addFAQ } = require('../controllers/faqController');
const router = express.Router();

router.get('/', (req, res) => faq(req, res));

router.get('/dashboard', (req, res) => dashboard(req, res));

router.post('/add-faq', (req, res) => addFAQ(req, res));


module.exports = router;