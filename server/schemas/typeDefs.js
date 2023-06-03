const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID
        username: String
        email: String
        friendCount: Int
        posts: [Post]
        comments: [Comment]
        friends: [User]
        avatar: String
    }

    type Post {
        _id: ID
        postTitle: String
        postBody: String
        postDate: String
        postAuthor: User
        postComments: [Comment]
    }

    type Comment {
        _id: ID
        commentBody: String
        commentDate: String
        commentAuthor: User
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        me: User
        users: [User]
        user(username: String!): User
        posts(username: String): [Post]
        post(_id: ID!): Post
        comments(username: String): [Comment]
        comment(_id: ID!): Comment
    }

    type Mutation {
        addUser(username: String!, email: String!, password: String!): Auth
        login(email: String!, password: String!): Auth
        updateUser(username: String, email: String, password: String, avatar: String): User
        addPost(postTitle: String!, postBody: String!): Post
        addComment(postId: ID!, commentBody: String!): Comment
        addFriend(friendId: ID!): User
        removeFriend(friendId: ID!): User
        removePost(postId: ID!): Post
        removeComment(commentId: ID!): Comment
    }
`;

module.exports = typeDefs;
        
