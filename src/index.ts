import 'dotenv/config'

import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

import { CompetitionMutations, CompetitionQueries } from './Server/Module/Competition/Resolver'
import { CompetitionTypeDefs } from './Server/Module/Competition/Schema'

const server = new ApolloServer({
  typeDefs: CompetitionTypeDefs,
  resolvers: {
    ...CompetitionQueries,
    ...CompetitionMutations,
  },
})

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
})

console.log(`🚀  Server ready at: ${url}`)
