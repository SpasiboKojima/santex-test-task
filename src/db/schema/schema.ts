import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const competition = pgTable('competition', {
  name: text('name'),
  code: text('code').primaryKey(),
  areaName: text('areaName'),
})

export const team = pgTable('team', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  leagueCode: text('leagueCode').references(() => competition.code),
  tla: text('tla'),
  shortName: text('shortName'),
  areaName: text('areaName'),
  address: text('address'),
})

export const player = pgTable('player', {
  id: serial('id').primaryKey(),
  teamName: text('teamName').references(() => team.name),
  name: text('name'),
  position: text('position'),
  dateOfBirth: date('dateOfBirth'),
  nationality: text('nationality'),
})

export const couch = pgTable('couch', {
  id: serial('id').primaryKey(),
  name: text('name'),
  dateOfBirth: date('dateOfBirth'),
  nationality: text('nationality'),
})
