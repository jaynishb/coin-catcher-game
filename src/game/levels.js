
export const BLOCK_MAX_DENSITY = 3

const PADDLE_SPEED = 1.5

export const InitialLevel = {
  paddleSpeed: PADDLE_SPEED,
  lives: 5,
  paddleWidth: 5,
  ballSpeed: 1,
  bombSpeed: 1.2,
  numberOfBombs: 0,
  numberOfCoins: 3,
}


export const LEVELS = {
  50: {
    paddleSpeed: PADDLE_SPEED,
    lives: 5,
    paddleWidth: 5,
    ballSpeed: 1,
    bombSpeed: 1.2,
    numberOfBombs: 2,
    numberOfCoins: 3,
  },
  100: {
    paddleSpeed: PADDLE_SPEED,
    lives: 5,
    paddleWidth: 5,
    ballSpeed: 1,
    bombSpeed: 1.4,
    numberOfBombs: 3,
    numberOfCoins: 4,
  },
  150: {
    paddleSpeed: PADDLE_SPEED,
    lives: 5,
    paddleWidth: 5,
    ballSpeed: 1,
    bombSpeed: 1.5,
    numberOfBombs: 4,
    numberOfCoins: 4,
  },
  200: {
    paddleSpeed: PADDLE_SPEED,
    lives: 5,
    paddleWidth: 5,
    ballSpeed: 1,
    bombSpeed: 1.5,
    numberOfBombs: 5,
    numberOfCoins: 4,
  }
}
