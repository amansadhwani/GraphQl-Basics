import { ApolloServer, gql } from "apollo-server";
import { error } from "console";

import { randomUUID } from "crypto";

const users = [
  {
    id: "1",
    firstName: "Aman",
    lastName: "Sadhwani",
    password: 1234,
    email: "aman@gmail.com",
  },
  {
    id: "2",
    firstName: "Rafa",
    lastName: "Nadal",
    password: 1200,
    email: "rafa@gmail.com",
  },
];

const todos = [
  {
    id: "1",
    task: "reactjs",
  },
  {
    id: "2",
    task: "aws",
  },
];

// schema
// ! means required field
const typeDefs = gql`
  type Query {
    greet: String
    country: String
    users: [User]
    getUserByUserId(id: ID!): User
  }
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    todos: [Todo]
  }

  type Todo {
    id: ID!
    task: String!
  }

  input UserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  type Mutation {
    createNewUser(userNew: UserInput!): User
  }
`;
// query resolvers
const resolvers = {
  Query: {
    greet: () => "Hello World",
    country: () => "Canada",
    users: () => users,
    getUserByUserId: (parent, { id }, { userLoggedIn }) => {
      if (!userLoggedIn) throw new error("You are not logged in ");
      // conext will be helpful when we need to combine multiple query
      return users.find((item) => item.id == id);
    },
  },
  User: {
    todos: (parent) => {
      console.log(parent); // here look how todos is inside user
      return todos.filter((todo) => todo.id === parent.id);
    },
  },
  Mutation: {
    createNewUser: (_, { userNew }) => {
      // _ means parent as we are not using
      const addNewuser = { id: randomUUID, ...userNew };
      users.push(addNewuser);
      return addNewuser;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    userLoggedIn: false,
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at: ${url}`);
});
