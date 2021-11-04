const mongoose = require('mongoose');
const { transformSchema } = require('../utils/mongoose.utils');

const songSchema = new mongoose.Schema({
    name: String,
    spotify_uri: String
});

songSchema.set('toJSON', { transform: transformSchema });

mongoose.model('Song', songSchema);

const songRequestSchema = new mongoose.Schema({
    name: String,
    song: {        
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song'
    },
    active: Boolean,
    createdBy: {        
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},
{
  timestamps: true
});

songRequestSchema.set('toJSON', { transform: transformSchema });

mongoose.model('SongRequest', songRequestSchema);
