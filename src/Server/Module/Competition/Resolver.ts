import CompetitionController from '../../Controller/Competition'

const CompetitionQueries: any = {
  Query: {
    players: CompetitionController.Queries.players,
    team: CompetitionController.Queries.team,
  },
}

const CompetitionMutations: any = {
  Mutation: {
    importLeague: CompetitionController.Mutations.importLeague,
  },
}

export { CompetitionQueries, CompetitionMutations }
