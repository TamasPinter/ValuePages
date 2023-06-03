const mongoose = require('mongoose');
const { Schema } = mongoose;
const Comment = require('./Comment');
const User = require('./User');

const postSchema = new Schema({
    postTitle: {
        type: String,
        required: true,
        trim: true,
        minLength: 5,
        maxLength: 50,
    },

    postBody: {
        type: String,
        required: true,
        trim: true,
        minLength: 5,
        maxLength: 500,
    },

    postAuthor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },

    postComments: [Comment.schema],

    postDate: {
        type: Date,
        default: date.now,
    },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
