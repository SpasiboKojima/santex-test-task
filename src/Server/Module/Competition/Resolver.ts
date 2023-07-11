import axios, { AxiosError } from 'axios'
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
      try {
        const competitionResponse = await axios.get<ApiCompetitionResponse>(`https://api.football-data.org/v4/competitions/${leagueCode}`, {
          headers: { 'X-Auth-Token': process.env.FOOTBALL_API_TOKEN },
        })
        const { data: competitionData } = competitionResponse

        const competitionObj = { name: competitionData.name, code: competitionData.code, areaName: competitionData.area.name }

        await db.insert(competition).values(competitionObj).onConflictDoNothing()

        const teamsResponse = await axios.get<ApiCompetitionTeamsResponse>(
          `https://api.football-data.org/v4/competitions/${leagueCode}/teams`,
          {
            headers: { 'X-Auth-Token': process.env.FOOTBALL_API_TOKEN },
          },
        )
        const { data: teamsData } = teamsResponse

        const teams = teamsData.teams.map((team) => ({
          id: team.id,
          name: team.name,
          leagueCode: teamsData.competition.code,
          tla: team.tla,
          shortName: team.shortName,
          areaName: team.area.name,
          address: team.address,
          players: team.squad.map((player) => ({
            id: player.id,
            name: player.name,
            teamName: team.name,
            position: player.position,
            dateOfBirth: player.dateOfBirth,
            nationality: player.nationality,
          })),
        }))

        await db.insert(team).values(teams).onConflictDoNothing()

        const players = teams.map((team) => team.players).flatMap((player) => player)
        await db.insert(player).values(players).onConflictDoNothing()

        return returnSuccessResponse({
          competition: competitionObj,
          teams,
        })
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          if (err.response?.status === 429)
            throw new GraphQLError('API limit  hit, league is not imported', {
              extensions: {
                code: 'TOO MANY REQUESTS',
              },
            })
        }
        throw new GraphQLError('League import failed')
      }
    },
  },
}

export { CompetitionQueries, CompetitionMutations }
