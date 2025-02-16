import User from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const secretKey = 'v29b0v9nqipompdoimiufn80qnqnq80b3p48n';

export default {
    async register(userData) {
        if (userData.password !== userData.confirmPassword) {
            throw new Error('Passwords do not match!');
        }

        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            throw new Error('An account with this email already exists!');
        }

        try {
            const user = new User(userData);
            await user.save();
            console.log('User saved successfully');

            const token = jwt.sign(
                { _id: user._id, email: user.email, username: user.username }, // Use the user object here
                secretKey,
                { expiresIn: '2h' }
            );
            return token
        } catch (err) {
            console.error('Error saving user:', err);
            throw err;
        }
    },

    async login(userData) {
        const existingUser = await User.findOne({ email: userData.email });
        if (!existingUser) {
            throw new Error('Invalid credentials!');
        }

        const isMatch = await bcrypt.compare(userData.password, existingUser.password);
        if (!isMatch) {
            throw new Error('Invalid credentials!');
        }

        const token = jwt.sign(
            { _id: existingUser._id, email: existingUser.email, username: existingUser.username },
            secretKey,
            { expiresIn: '2h' }
        );
        return token
    },

    secretKey
};