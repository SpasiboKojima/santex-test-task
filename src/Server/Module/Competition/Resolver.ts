import { and, eq, inArray } from 'drizzle-orm'
import { GraphQLError } from 'graphql'
import { db } from 'src/db/db'
import { competition, player, team } from 'src/db/schema/schema'
import { returnSuccessResponse } from 'src/helpers/Response'

import { ApiCompetitionResponse, ApiCompetitionTeamsResponse } from './Types'

interface ImportLeagueArgs {
  leagueCode: string
  teamName?: string
}

interface TeamArgs {
  name: string
}

const CompetitionQueries = {
  Query: {
    players: async (_, { leagueCode, teamName }: ImportLeagueArgs) => {
      const teamsConditions = [eq(team.leagueCode, leagueCode)]
      if (teamName) {
        teamsConditions.push(eq(team.name, teamName))
      }
      const teamsResponse = await db
        .select()
        .from(team)
        .where(and(...teamsConditions))
      const teamNames = teamsResponse.map((team) => team.name)
      if (!teamNames.length) {
        throw new GraphQLError('Provided league is not imported', {
          extensions: {
            code: 'NOT FOUND',
            argumentName: 'leagueCode',
          },
        })
      }
      const players = await db.select().from(player).where(inArray(player.teamName, teamNames))

      return players
    },
    team: (_, { name }: TeamArgs) => db.select().from(team).where(eq(team.name, name)),
  },
  Team: {
    players: (parent) => db.select().from(player).where(eq(player.teamName, parent.name)),
  },
}

const CompetitionMutations = {
  Mutation: {
    importLeague: async (_, { leagueCode }: ImportLeagueArgs) => {
      const competitionResponse: ApiCompetitionResponse = await fetch(`https://api.football-data.org/v4/competitions/${leagueCode}`, {
        headers: [['X-Auth-Token', '']],
      }).then((response) => response.json())

      const competitionObj = { name: competitionResponse.name, code: competitionResponse.code, areaName: competitionResponse.area.name }
      await db.insert(competition).values(competitionObj)

      const teamsResponse: ApiCompetitionTeamsResponse = await fetch(`https://api.football-data.org/v4/competitions/${leagueCode}/teams`, {
        headers: [['X-Auth-Token', '']],
      }).then((response) => response.json())

      const teams = teamsResponse.teams.map((team) => ({
        name: team.name,
        tla: team.tla,
        shortName: team.shortName,
        areaName: team.area.name,
        address: team.address,
        players: team.squad.map((player) => ({
          name: player.name,
          position: player.position,
          dateOfBirth: player.dateOfBirth,
          nationality: player.nationality,
        })),
      }))
      await db.insert(team).values(teams)

      return returnSuccessResponse({
        competition: competitionObj,
        teams,
      })
    },
  },
}

export { CompetitionQueries, CompetitionMutations }
