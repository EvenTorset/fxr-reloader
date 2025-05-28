#!/usr/bin/env node

import fs from 'node:fs/promises'

import reloadFXR, { Affinity, Weapon } from './reloader.js'

const fileName = process.argv[2]
const respawn = process.argv.length > 3

let weapon: number | undefined
const weaponArg = process.argv[3]
if (typeof weaponArg === 'string') {
  if (/^\d+$/.test(weaponArg)) {
    weapon = parseInt(weaponArg)
  } else {
    if (weaponArg.includes('+')) {
      const s = weaponArg.split('+')
      weapon = Weapon[s[0]] + Affinity[s[1]]
    } else {
      weapon = Weapon[weaponArg]
    }
  }
}

const dummyPoly = typeof process.argv[4] === 'string' ?
  parseInt(process.argv[4]) :
  undefined
const endpoint =
  typeof process.argv[5] === 'string' &&
  /^\d+$/.test(process.argv[5]) ?
    parseInt(process.argv[5]) :
    process.argv[5]

await reloadFXR(await fs.readFile(fileName), {
  respawn,
  weapon,
  dummyPoly,
  endpoint
})
