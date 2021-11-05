const mongoose = require('mongoose');
const { transformSchema } = require('../utils/mongoose.utils');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    username: {
        type: String,
        required: [ true, 'Username can not be blank.' ],
        match: [ /^[a-zA-Z0-9]+$/, 'Username format is invalid.' ],
        index: true,
        unique: true, // make unique and case insensitive
        trim: true
    },
    email: {
        type: String,
        lowercase: true, 
        required: [ true, 'Email can not be blank.' ],
        match: [ /\S+@\S+\.\S+/, 'Email format is invalid.' ],
        index: true,
        unique: true,
        trim: true
    },
    bio: String,
    image: String,
    favorites: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Song'
        }
    ],
    verified: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: true
    },
    hash: String,
    salt: String
}, { timestamps: true });

userSchema.plugin(uniqueValidator, { message: 'Username/email already taken.' });

userSchema.methods.validPassword = (password, user) => {
    const hash = crypto.pbkdf2Sync(password, user.salt, 10000, 512, 'sha512').toString('hex');
    return user.hash === hash;
};

userSchema.methods.setPassword = (password, user) => {
    user.salt = crypto.randomBytes(16).toString('hex');
    user.hash = crypto.pbkdf2Sync(password, user.salt, 10000, 512, 'sha512').toString('hex');
};

userSchema.methods.generateJWT = (user) => {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        id: user._id,
        username: user.username,
        exp: parseInt(exp.getTime() / 1000),
    }, secret);
};

userSchema.methods.toAuthJSON = (user) => {
    return {
        username: user.username,
        email: user.email,
        token: user.generateJWT(user),
        bio: user.bio,
        image: user.image
    };
};

userSchema.methods.toProfileJSONFor = () => {
    return {
        username: this.username,
        bio: this.bio,
        image: this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg' // to set
    };
};

userSchema.methods.favorite = (id) => {
    if (this.favorites.indexOf(id) === -1) {
        this.favorites.push(id);
    }

    return this.save();
};

userSchema.methods.unfavorite = (id) => {
    this.favorites.remove(id);
    return this.save();
};

userSchema.methods.isFavorite = (id) => {
    return this.favorites.some(favoriteId => {
        return favoriteId.toString() === id.toString();
    });
};

userSchema.set('toJSON', { transform: transformSchema });

mongoose.model('User', userSchema);
