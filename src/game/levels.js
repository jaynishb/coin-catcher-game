import { getRange } from '../utils'

export const BLOCK_MAX_DENSITY = 3

const getRandomBlock = () => Math.floor(Math.random() * BLOCK_MAX_DENSITY)

const getBlocks = (rows, columns) =>
  getRange(rows).map(() => getRange(columns).map(getRandomBlock))
export const LEVELS = [
  {
    lives: 5,
    paddleWidth: 5,
    speed: 1.2,
    blocks: getBlocks(2, 12)
  }
]

export const BombLevel = {
  50: 1,
  150: 2,
  250: 3,
  300: 4
}
