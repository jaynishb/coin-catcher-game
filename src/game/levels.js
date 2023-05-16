import { getRange } from '../utils'

export const BLOCK_MAX_DENSITY = 3

const getRandomBlock = () => Math.floor(Math.random() * BLOCK_MAX_DENSITY)

const getBlocks = (rows, columns) =>
  getRange(rows).map(() => getRange(columns).map(getRandomBlock))
export const LEVELS = [
  {
    lives: 5,
    paddleWidth: 10,
    speed: 1.2,
    blocks: getBlocks(2, 12)
  }
]
