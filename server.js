const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const connectDB = require('./config/database');
const redisClient = require('./config/redis');
const {RedisStore} = require("connect-redis")
const authRoutes = require('./routes/authRoutes');
const faqRoutes = require('./routes/faqRoutes');
require('dotenv').config();

const app = express();
connectDB();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(authRoutes);
app.use(faqRoutes);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
