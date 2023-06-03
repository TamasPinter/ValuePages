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
    addUser: async (parent, args) => {
        const user = await User.create(args);
        const token = signToken(user);
        return { token, user };
    },

    login: async (parent, { email, password }) => {
        const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError('Incorrect Email');
            }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError('Incorrect Password');
            }
            const token = signToken(user);
            return { token, user };
    },

    updateUser: async (parent, args, context) => {
        if (context.user) {
            return User.findByIdAndUpdate(context.user._id, args, { new: true });
        }
        throw new AuthenticationError('Not logged in');
    },

    addFriend: async (parent, args, context) => {
        if (context.user) {
            const updatedUser = await User.findByIdAndUpdate(
                { _id: context.user._id },
                { $addToSet: { friends: args.friendId } },
                { new: true }
            ).populate('friends');
        }
        throw new AuthenticationError('Not logged in');
    },

    removeFriend: async (parent, args, context) => {
        if (context.user) {
            const updatedUser = await User.findByIdAndUpdate(
                { _id: context.user._id },
                { $pull: { friends: args.friendId } },
                { new: true }
            ).populate('friends');
        }
        throw new AuthenticationError('Not logged in');
    },

    addPost: async (parent, args, context) => {
        if (context.user) {
            const post = await Post.create({ ...args, username: context.user.username });
        }
        throw new AuthenticationError('Not logged in');
    },

    addComment: async (parent, args, context) => {
        if (context.user) {
            const comment = await Comment.create({ ...args, username: context.user.username });
        }
        throw new AuthenticationError('Not logged in');
    },

    removePost: async (parent, { _id }, context) => {
        if (context.user) {
            const post = await Post.findOneAndDelete({ _id, username: context.user.username });
        }
        throw new AuthenticationError('Not logged in');
    },

    removeComment: async (parent, { _id }, context) => {
        if (context.user) {
            const comment = await Comment.findOneAndDelete({ _id, username: context.user.username });
        }
        throw new AuthenticationError('Not logged in');
    },
},
};

module.exports = resolvers;

