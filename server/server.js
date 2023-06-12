const express = require('express');
// Import the ApolloServer class
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');

// Import the two parts of a GraphQL schema
const { typeDefs, resolvers } = require('./schemas');

const path = require('path');
const db = require('./config/connection');


const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build'));
});


const startApolloServer = async (typeDefs, resolvers) => {
    await server.start();
    server.applyMiddleware({ app });
    console.log("Hello");
    db.once('open', () => {
      app.listen(PORT, () => {
        console.log(`🌍 Now listening on localhost:${PORT}`);
        console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
})
};

// Call the async function to start the server
startApolloServer(typeDefs, resolvers);