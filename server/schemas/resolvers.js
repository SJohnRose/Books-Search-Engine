const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    user: async (parent, args) => {
        return await User.findOne(args.username);
    },
    // By adding context to our query, we can retrieve the logged in user without specifically searching for them
    me: async (parent, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return {token, user};
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user with this email found!');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect password!');
      }

      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, {authors, description, title, bookId, image, link}) => {
      const user = await User.findOneAndUpdate({authors, description, title, bookId, image, link});
      return user;
    },
    removeBook: async (parent, {bookId}) => {
      return User.findOneAndDelete({bookId: bookId});
    }
    
  },
};

module.exports = resolvers;