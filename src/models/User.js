import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: [2, 'Username must be at least 2 characters long.']
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
        minlength: [10, 'Email must be at least 10 characters long.']
    },
    password: {
        type: String,
        required: true,
        minlength: [4, 'Password must be at least 4 characters long.']
    },
    repeatPassword: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                return value === this.password; 
            },
            message: 'Repeat password must match the password.'
        }
    }
}, { timestamps: true });

userSchema.pre('save', async function() {
    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
    } catch (err) {
        console.log(err);
    }
});

const User = model('User', userSchema);

export default User;