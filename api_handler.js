const fs = require('fs');
require('dotenv').config();
const { ApolloServer } = require('apollo-server-express');

const GraphQLDate = require('./graphql_date.js');
const about = require('./about.js');
const branch = require('./branch.js');
const auth = require('./auth.js');

const resolvers = {
  Query: {
    about: about.getMessage,
    //User: auth.resolveUser,
    aBranch: branch.get,
    allBranches: branch.list,
  },
  Mutation: {
    setAboutMessage: about.setMessage,
    branchAdd: branch.add,
    branchUpdate: branch.update,
    branchDelete: branch.delete,
    branchRestore: branch.restore,
  },
  GraphQLDate,
};

function getContext({ req }) {
  const user = auth.getUser(req);
  return { user };
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
  resolvers,
  context: getContext,
  formatError: (error) => {
    console.log(error);
    return error;
  },
  playground: true,
  introspection: true,
});

function installHandler(app) {
  const enableCORS = (process.env.ENABLE_CORS || 'true') === 'true';
  console.log('CORS setting:', enableCORS);
  let cors;
  if (enableCORS) {
    const origin = process.env.UI_SERVER_ORIGIN || 'http://localhost:8000';
    const methods = 'POST';
    cors = { origin, methods, credentials: true };
  } else {
    cors = 'false';
  }
  server.applyMiddleware({
    app,
    path: '/graphql',
    cors: enableCORS,
  });
}

module.exports = { installHandler };
