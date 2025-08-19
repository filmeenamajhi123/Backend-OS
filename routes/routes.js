require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Model = require('../model/model');

const SECRET_KEY = process.env.JWT_SECRET;

router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    try {
        let existingUser = await Model.findOne({ email });
        if(existingUser){
            return res.status(400).json({ error : "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new Model({ username: req.body.username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User created successfully" });
    }
    catch (err) {
        res.status(500).json({ error: "Signup failed", details : err.message})
    }
})

router.post('/login', async(req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Model.findOne({ email });
        if(!user) {
            return res.status(400).json({ error: "User not found"});
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).json({ error: 'Invalid credentials' });

        let token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: "1h"});
        res.json({ token });
    } 
    catch (err) {
        res.status(500).json({ error: "Login failed", details: err.message })
    }
})

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if(!token) return res.status(401).json({ error: "Token required" });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if(err) return res.status(403).json({ error: "Invalid token" });
            req.user = user;
            next();
    });
}

router.get("/profile", authenticateToken, (req, res) => {
    res.json({ message: "Welcome to profile", user: req.user });
})

module.exports = router;