import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const competition = pgTable('competition', {
  id: serial('id').primaryKey(),
  name: text('name'),
  code: text('code'),
  areaName: text('areaName'),
})

export const team = pgTable('team', {
  id: serial('id').primaryKey(),
  name: text('name'),
  tla: text('tla'),
  shortName: text('shortName'),
  areaName: text('areaName'),
  address: text('address'),
})

export const player = pgTable('player', {
  id: serial('id').primaryKey(),
  name: text('name'),
  position: text('position'),
  dateOfBirth: text('dateOfBirth'),
  nationality: text('nationality'),
})

export const couch = pgTable('couch', {
  id: serial('id').primaryKey(),
  name: text('name'),
  dateOfBirth: text('dateOfBirth'),
  nationality: text('nationality'),
})
