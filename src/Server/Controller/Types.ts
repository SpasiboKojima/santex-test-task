interface ApiSeason {
  id: number
  startDate: string
  endDate: string
  currentMatchday: number
  winner: {
    id: number
    name: string
    shortName: string
    tla: string
    crest: string
    address: string
    website: string
    founded: number
    clubColors: string
    venue: string
    lastUpdated: string
  } | null
}

export interface ApiCompetitionResponse {
  area: {
    id: number
    name: string
    code: string
    flag: string
  }
  id: number
  name: string
  code: string
  type: string
  emblem: string
  currentSeason: ApiSeason
  seasons: ApiSeason[]
  lastUpdated: string
}

interface ApiTeamStanding {
  position: number
  team: {
    id: number
    name: string
    shortName: string
    tla: string
    crest: string
  }
  playedGames: number
  form: null
  won: number
  draw: number
  lost: number
  points: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
}

interface ApiSquadMember {
  id: number
  name: string
  position: string
  dateOfBirth: string
  nationality: string
}

interface ApiStaffMember {
  id: number
  firstName: string
  lastName: string
  name: string
  dateOfBirth: string
  nationality: string
  contract?: {
    start: string
    until: string
  }
}

export interface ApiCompetitionTeamsResponse {
  count: number
  filters: {
    season: string
  }
  competition: {
    id: number
    name: string
    code: string
    type: string
    emblem: string
  }
  season: ApiSeason
  teams: [
    {
      area: {
        id: number
        name: string
        code: string
        flag: string
      }
      id: number
      name: string
      shortName: string
      tla: string
      crest: string
      address: string
      website: string
      founded: number
      clubColors: string
      venue: string
      runningCompetitions: {
        id: number
        name: string
        code: string
        type: string
        emblem: string
      }[]
      coach: ApiStaffMember
      squad: ApiSquadMember[]
      staff: ApiStaffMember[]
      lastUpdated: string
    },
  ]
}
