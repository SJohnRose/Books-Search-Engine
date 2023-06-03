const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    user: async (parent, args) => {
        return await User.findOne(args.username);
    },
    users: async () => {
      return await User.find({});
    },
    // By adding context to our query, we can retrieve the logged in user without specifically searching for them
    me: async (parent, args, context) => {
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
    loginUser: async (parent, { email, password }) => {
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
    saveBook: async (parent, {userId, authors, description, title, bookId, image, link}, context) => {
      if (context.user) {
        return User.findOneAndUpdate(
        {_id: userId},
        {
          $addToSet: {savedBooks: {authors, description, title, bookId, image, link}},
        },
        {
          new: true,
          runValidators: true,
        }
        );
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    removeBook: async (parent, {userId, bookId}, context) => {
      if (context.user) {
      return User.findOneAndUpdate(
        {_id: context.user._id},
        { $pull: {savedBooks: { _id: bookId}}},
        {new: true}
      );
    }
    throw new AuthenticationError('You need to be logged in!');
  },
}
};

module.exports = resolvers;