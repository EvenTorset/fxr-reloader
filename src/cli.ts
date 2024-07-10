#!/usr/bin/env node

import fs from 'node:fs/promises'

import { default as reloadFXR, Weapon } from './node.js'

const fileName = process.argv[2]
const respawn = process.argv.length > 3
const weapon = typeof process.argv[3] === 'string' ?
  process.argv[3].match(/^\d+$/) ? parseInt(process.argv[3]) : Weapon[process.argv[3]] :
  undefined
const dummyPoly = typeof process.argv[4] === 'string' ?
  parseInt(process.argv[4]) :
  undefined
const portOrURL =
  typeof process.argv[5] === 'string' &&
  /^\d+$/.test(process.argv[5]) ?
    parseInt(process.argv[5]) :
    process.argv[5]

await reloadFXR(
  await fs.readFile(fileName),
  respawn,
  weapon,
  dummyPoly,
  portOrURL
)
