const mongoose = require('mongoose');
const { transformSchema } = require('../utils/mongoose.utils');

const sessionSchema = new mongoose.Schema({
    name: {
        type: String
    },
    active: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // todo true
    }
},
{
  timestamps: true
});

sessionSchema.set('toJSON', { transform: transformSchema });

mongoose.model('Session', sessionSchema);