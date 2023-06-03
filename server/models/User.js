const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;
const Post = require('./Post');
const Comment = require('./Comment');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength: 5,
        maxLength: 20,
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Please enter a valid e-mail address'],
    },
    posts: [Post.schema],
    comments: [Comment.schema],
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    avatar: {
        type: String,
        default: 'https://via.placeholder.com/150',
    },
});

// set up pre-save middleware to create password
userSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }

    next();
}
);

// compare the incoming password with the hashed password
userSchema.methods.isCorrectPassword = async function (password) {
    return bcrypt.compare(password, this.password);
}

// get total count of friends on retrieval
userSchema.virtual('friendCount').get(function () {
    return this.friends.length;
});

const User = mongoose.model('User', userSchema);

module.exports = User;