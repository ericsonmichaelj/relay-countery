/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from 'graphql'

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions
} from 'graphql-relay'

import {
  // Import methods that your schema can use to interact with your database
  User,
  Count,
  getUser,
  getCount,
  getViewer,
  incrementCount,
  decrementCount,
} from './database'

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId)
    if (type === 'User') {
      return getUser(id)
    } else if (type === 'Count') {
      return getCount(id)
    } else {
      return null
    }
  },
  (obj) => {
    if (obj instanceof User) {
      return userType
    } else if (obj instanceof Count)  {
      return countType
    } else {
      return null
    }
  }
);


const countType = new GraphQLObjectType({
  name: 'Widget',
  description: 'A shiny widget',
  fields: () => ({
    id: globalIdField('Widget'),
    name: {
      type: GraphQLString,
      description: 'The name of the widget',
    }
  }),
  interfaces: [nodeInterface]
})

/**
 * Define your own types here
 */

const userType = new GraphQLObjectType({
  name: 'User',
  description: 'A person who uses our app',
  fields: () => ({
    id: globalIdField('User'),
    count: {
      type: GraphQLInt,
      description: 'The count',
      resolve: (obj) => {
        return getCount(obj.id)
      }
    }
  })
})

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    // Add your own root fields here
    node: nodeField,
    counter: {
      type: userType,
      resolve: () => getViewer()
    }
  })
})

const IncrementCounterMutation = mutationWithClientMutationId({
  name: 'IncrementCounter',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    counter: {
      type: userType,
      resolve: () => getViewer()
    }
  },
  mutateAndGetPayload: ({ id }) => {
    const userId = fromGlobalId(id).id
    incrementCount(userId)
    return {}
  }
})

const DecrementCounterMutation = mutationWithClientMutationId({
  name: 'DecrementCounter',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    counter: {
      type: userType,
      resolve: () => getViewer()
    }
  },
  mutateAndGetPayload: ({ id }) => {
    const userId = fromGlobalId(id).id
    decrementCount(userId)
    return {}
  }
})

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    incrementCounter: IncrementCounterMutation,
    decrementCounter: DecrementCounterMutation
  })
})

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export const Schema = new GraphQLSchema({
  query: queryType,
  // Uncomment the following after adding some mutation fields:
  mutation: mutationType
})
