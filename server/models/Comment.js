const mongoose = require('mongoose');
const { Schema } = mongoose;
const User = require('./User');
const Post = require('./Post');

const commentSchema = new Schema({
    commentBody: {
        type: String,
        required: true,
        trim: true,
        minLength: 5,
        maxLength: 500,
    },

    commentAuthor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },

    commentDate: {
        type: Date,
        default: Date.now,
    },

    commentPost: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
    },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;