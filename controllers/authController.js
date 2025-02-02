const User = require('../models/user.model');

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        let user = await User.findOne({ username });
        if (user) return res.redirect('/register?error=User already exists');

        user = new User({ username, password });
        await user.save();
        res.redirect('/login');
    } catch (err) {
        res.status(500).send("Server Error");
    }
};

exports.login = (req, res) => {
    res.redirect('/dashboard');
};

exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/login');
    });
};
