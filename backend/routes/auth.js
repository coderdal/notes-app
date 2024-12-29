import express from 'express';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { encryptPassword, generateSalt, encryptToken } from '../utils/helper.js';
import pool from '../config/db.js';
import 'dotenv/config';

const router = express.Router();

router.post('/signup', async (req, res) => {
    const schema = Joi.object({
        email: Joi.string().min(5).email().required(),
        password: Joi.string().min(8).required(),
        username: Joi.string().min(5).required()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { email, password, username } = req.body;
    const { password: encryptedPassword, salt } = encryptPassword(password, generateSalt());

    try {
        const emailExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (emailExists.rows.length > 0) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        const usernameExists = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (usernameExists.rows.length > 0) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        const result = await pool.query(
            'INSERT INTO users (username, email, password_hash, password_salt) VALUES ($1, $2, $3, $4) RETURNING *',
            [username, email, encryptedPassword, salt]
        );
        const user = result.rows[0];
        res.status(201).json({ user: { id: user.id, username: user.username, email: user.email } });
    } catch (err) {
        throw new Error("Server Signup Error");
    }
});

router.post('/login', async (req, res) => {
    const schema = Joi.object({
        email: Joi.string().min(5).email().required(),
        password: Joi.string().min(8).required()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { email, password } = req.body;
    const device = req.device;

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) return res.status(400).json({ error: 'Invalid email or password' });

        const user = result.rows[0];
        const { password: encryptedPassword } = encryptPassword(password, user.password_salt);

        if (encryptedPassword !== user.password_hash) return res.status(400).json({ error: 'Invalid email or password' });

        const accessToken = jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '15d' });
        const hashedRefreshToken = encryptToken(refreshToken);

        await pool.query(
            'INSERT INTO refresh_tokens (user_id, token, device) VALUES ($1, $2, $3)',
            [user.id, hashedRefreshToken, device]
        );

        res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict', secure: true, maxAge: 1000 * 60 * 60 * 24 * 15, path: '/auth/token' });
        res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'strict', secure: true, maxAge: 1000 * 60 * 15, path: '/' });

        res.status(200).json({ message: 'Logged in successfully.', user: { id: user.id, username: user.username, email: user.email } });
    } catch (err) {
        throw new Error("Server Login Error");
    }
});

router.post('/token', async (req, res) => {
    const token = req.cookies.refreshToken;
    const device = req.device;

    if (!token) return res.status(403).json({ error: 'Forbidden' });

    try {
        const hashedToken = encryptToken(token);
        const result = await pool.query('SELECT * FROM refresh_tokens WHERE token = $1 AND device = $2', [hashedToken, device]);
        if (result.rows.length === 0) return res.status(403).json({ error: 'Token invalid or expired.' });

        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(403).json({ error: 'Token invalid or expired.' });

            const accessToken = jwt.sign({ userId: user.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

            res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'strict', secure: true, maxAge: 1000 * 60 * 15, path: '/' });

            res.status(201).json({ message: 'Token created successfully.' });
        });
    } catch (err) {
        throw new Error("Server Token Error");
    }
});

export default router;