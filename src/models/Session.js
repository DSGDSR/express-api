const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { transformSchema } = require('../utils/mongoose.utils');

const sessionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // todo true
    }
},
{
  timestamps: true
});

sessionSchema.plugin(mongoosePaginate);

sessionSchema.set('toJSON', { transform: transformSchema });

mongoose.model('Session', sessionSchema);
