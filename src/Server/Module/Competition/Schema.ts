const CompetitionTypeDefs = `#graphql
  type Competition {
    name: String
    code: String
    areaName: String
  }

  type Team {
    name: String
    tla: String
    shortName: String
    areaName: String
    address: String
  }

  type Player {
    name: String
    teamName: String
    position: String
    dateOfBirth: String
    nationality: String
  }

  type Coach {
    name: String
    dateOfBirth: String
    nationality: String
  }

  type Query {
    players(leagueCode: String!, teamName: String): [Player]
    team(name: String!): [Team]
  }

  interface MutationResponse {
    code: String!
    success: Boolean!
    message: String!
  }
    
  type ImportLeagueRequestMutationResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    competition: Competition
    teams: [Team]
  }

  type Mutation {
    importLeague(leagueCode: String!): ImportLeagueRequestMutationResponse
  }
`

export { CompetitionTypeDefs }
