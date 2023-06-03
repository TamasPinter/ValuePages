const { AuthenticationError } = require('apollo-server-express');
const { User, Post, Comment } = require('../models');
const { signToken } = require('../utils/auth');


const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                    .populate('posts')
                    .populate('comments')
                    .populate('friends');
            }
            throw new AuthenticationError('Not logged in');
        },
        users: async () => {
            return User.find()
                .select('-__v -password')
                .populate('posts')
                .populate('comments')
                .populate('friends');
        },
        user: async (parent, { username }) => {
            return User.findOne({ username })
                .select('-__v -password')
                .populate('posts')
                .populate('comments')
                .populate('friends');
    },
    posts: async (parent, { username }) => {
        const params = username ? { username } : {};
        return Post.find(params).sort({ createdAt: -1 });
    },
    post: async (parent, { _id }) => {
        return Post.findOne({ _id });
    },
    comments: async (parent, { username }) => {
        const params = username ? { username } : {};
        return Comment.find(params).sort({ createdAt: -1 });
    },
    comment: async (parent, { _id }) => {
        return Comment.findOne({ _id });
    }
},

Mutation: {

}

