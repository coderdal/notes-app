import express from 'express';
import Joi from 'joi';
import { encryptPassword } from '../helper/helper.js';

const router = express.Router();

router.post('/signup', (req, res) => {
    const schema = Joi.object({
        email: Joi.string().min(5).email().required(),
        password: Joi.string().min(8).required(),
        username: Joi.string().min(5).required()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { email, password, username } = req.body;
    const { password: encryptedPassword, salt } = encryptPassword(password);

    res.send(`Signup page is running !`);
});

export default router;