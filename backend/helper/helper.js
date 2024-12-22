const { createHmac, randomBytes } = await import('node:crypto');
import 'dotenv/config';

export const encryptPassword = (password = '') => {
    if (!password) return { password: null, salt: null };

    try {
        const salt = randomBytes(16).toString('hex');
        password = `${password}${salt}`;
        const encryptedPassword = createHmac('sha256', process.env.HASH_SECRET_KEY).update(password).digest('hex');
        return { password: encryptedPassword, salt };
    } catch (error) {
        console.error('Error in encryptPassword: ', error);
        throw new Error('Error while encryption password: '  + error.name);
    }
};