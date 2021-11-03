const mongoose = require('mongoose');
const { transformSchema } = require('../utils/mongoose.utils');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    active: {
        type: Boolean,
        default: true
    }
},
{
  timestamps: true
});

userSchema.set('toJSON', { transform: transformSchema });

mongoose.model('User', userSchema);
