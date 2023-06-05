const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID!
        username: String!
        email: String!
        password: String!
        bookCount: String
        savedBooks: [Book]
    }
    
    type Book {
        _id: ID!,
        authors: [String]
        description: String!
        bookId: String!
        image: String
        link: String
        title: String!
    }

    type Auth {
        token: String!
        user: User
        
    }
    
    type Query {
        me: User
        user: User
        users: [User]
    }
    
    type Mutation {
        loginUser(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(userId: ID!, authors: [String], description: String!, bookId: String!, image: String, link: String, title: String!): User
        removeBook(bookId: String!): User
    }
    `;

module.exports = typeDefs;