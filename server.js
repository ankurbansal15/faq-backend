const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const connectDB = require('./config/database');
const redisClient = require('./config/redis');
const {RedisStore} = require("connect-redis")
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();
connectDB();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(authRoutes);

app.get('/', (req, res) => {
    const faqs = [
        {
            question: "What is Untitled UI?",
            answer: "Untitled UI is a comprehensive design system and component library for building modern web applications."
        },
        {
            question: "How do I get started with Untitled UI?",
            answer: "You can get started by signing up for an account on our website and exploring our documentation and tutorials."
        },
        {
            question: "Is there a free trial available?",
            answer: "Yes, we offer a 14-day free trial for all new users. You can sign up for the trial on our pricing page."
        },
        {
            question: "Can I use Untitled UI for commercial projects?",
            answer: "Our licensing allows for use in both personal and commercial projects. Check our licensing page for more details."
        },
    ];

    res.render('home', { faqs });
});

app.get('/dashboard', (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/login');
    const faqs = [
        {
            question: "What is Untitled UI?",
            answer: "Untitled UI is a comprehensive design system and component library for building modern web applications."
        },
        {
            question: "How do I get started with Untitled UI?",
            answer: "You can get started by signing up for an account on our website and exploring our documentation and tutorials."
        },
        // Add more existing FAQs as needed
    ];
    const { user } = req;
    res.render('dashboard', { faqs, user });
});

app.post('/add-faq', (req, res) => {
    const { question, answer } = req.body;
    // Here you would typically save this to your database
    console.log('New FAQ:', { question, answer });
    res.json({ success: true });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
