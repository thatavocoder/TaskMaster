const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/dev');

router.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(422).json({ error: 'Please enter all fields', success: false });
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if (savedUser) {
                return res.status(422).json({ error: 'User already exists', success: false });
            }
            bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        name,
                        email,
                        password: hashedPassword
                    })
                    user.save()
                        .then(user => {
                            res.json({ message: 'User created successfully!', success: true });
                        })
                        .catch(err => {
                            res.status(422).json({ error: err, success: false });
                        })
                })
                .catch(err => {
                    res.status(422).json({ error: err, success: false });
                })
        })
        .catch(err => {
            res.status(422).json({ error: err, success: false });
        })
})

router.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: 'Please enter all fields', success: false });
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({ error: 'Invalid email or password', success: false });
            }
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {
                        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
                        res.json({
                            message: 'Successful login',
                            success: true,
                            token: token,
                            name: savedUser.name,
                            email: savedUser.email
                        })
                    } else {
                        return res.status(422).json({ error: 'Invalid email or password', success: false });
                    }
                })
                .catch(err => {
                    res.status(422).json({ error: err, success: false });
                })
        })
        .catch(err => {
            res.status(422).json({ error: err, success: false });
        })
})

module.exports = router;