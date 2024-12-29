const { createHmac, randomBytes } = await import('node:crypto');
import 'dotenv/config';

export const encryptPassword = (password = '', salt = '') => {
    if (!password || !salt) return { password: null, salt: null };

    try {
        password = `${password}${salt}`;
        const encryptedPassword = createHmac('sha256', process.env.HASH_SECRET_KEY).update(password).digest('hex');
        return { password: encryptedPassword, salt };
    } catch (error) {
        console.error('Error in encryptPassword: ', error);
        throw new Error('Error while encryption password: '  + error.name);
    }
};

export const generateSalt = () => {
    try {
        return randomBytes(16).toString('hex');;
    } catch (error) {
        console.error('Error in generateSalt: ', error);
        throw new Error('Error while salt generation: '  + error.name);
    }
};

export const encryptToken = (token = '') => {
    try {
        return createHmac('sha256', process.env.REFRESH_TOKEN_STORE_SECRET).update(token).digest('hex');
    } catch (error) {
        console.error('Error in encryptToken: ', error);
        throw new Error('Error while encrypting token: '  + error.name);
    }
};
