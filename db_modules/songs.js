const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Song = mongoose.model('Song', new Schema({
    name: String,
    singer: String,
    size: Number,
    songUrl: String
}));

module.exports = Song;