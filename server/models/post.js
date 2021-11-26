const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    id: Number,
    title: String,
    body: String,
    userId: Number,
    is_read: Number,
    date: String
});

module.exports = mongoose.model('Post', postSchema);
