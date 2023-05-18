import Vector from './vector'
import { flatten, getRandomFrom, withoutElement, updateElement, randomRange, getRange } from '../utils'
import { BombLevel, InitialLevel, LEVELS } from './levels'

const BLOCK_HEIGHT = 5
const PADDLE_AREA = 1 / 3
const PADDLE_HEIGHT = BLOCK_HEIGHT
export const BALL_RADIUS = 1
const DISTANCE_IN_MS = 0.02
export const WIND = 0.003

export const MOVEMENT = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT'
}

const LEFT = new Vector(-1, 0)
const RIGHT = new Vector(1, 0)
const UP = new Vector(0, -1)
const DOWN = new Vector(0, 1)

const LEFT_UP = LEFT.add(UP).normalize()
const LEFT_DOWN = LEFT.add(DOWN).normalize()
const RIGHT_UP = RIGHT.add(UP).normalize()
const RIGHT_DOWN = RIGHT.add(DOWN).normalize()

const directions = [DOWN, RIGHT_DOWN, LEFT_DOWN]

const getDirectionIndex = () => Math.floor(Math.random() * (directions.length - 1))

export const getInitialPaddleAndBall = ({width, height}, level) => {
  const { numberOfCoins, numberOfBombs, paddleWidth } = getConfigByLevel(level)
  const paddleY = height - PADDLE_HEIGHT
  const paddle = {
    position: new Vector((width - paddleWidth) , paddleY),
    width: paddleWidth,
    height: PADDLE_HEIGHT
  }
  const balls = Array.from(Array(numberOfCoins)).map(()=> getInitialBall())
  const bombs = Array.from(Array(numberOfBombs)).map(()=> getInitialBomb())

  return {
    paddle,
    balls,
    bombs
  }
}

export const getConfigByLevel = (collected) => {
  const levelsScores = Object.keys(LEVELS);
  let levelConfig = InitialLevel

  for (var i = levelsScores.length - 1; i >= 0; i--) {
    const levelScore = levelsScores[i]
    if (collected > +levelScore) {
      return LEVELS[levelScore]
    };
  }
  return levelConfig
}

const getInitialBall = (width) => {
  return {
    center: new Vector(randomRange(10, width -10), 5),
    radius: BALL_RADIUS,
    direction: directions[getDirectionIndex()]
  }
}

const getInitialBomb = (width) => {
  return {
    center: new Vector(randomRange(10, width -10), 5),
    radius: BALL_RADIUS,
    direction: directions[getDirectionIndex()]
  }
}

export const getGameStateFromLevel = ({ lives, speed, level }, containerSize) => {
  const size = {
    width: Math.ceil(containerSize.width / 20) + 1,
    height: Math.ceil(containerSize.height / 20)
  }
  return {
    size,
    ...getInitialPaddleAndBall(size, level),
    lives,
    speed
  }
}

const getDistortedDirection = (vector, distortionLevel = 0.3) => {
  const getComponent = () => Math.random() * distortionLevel - distortionLevel / 2
  const distortion = new Vector(getComponent(), getComponent())
  return vector.add(distortion).normalize()
}

const getNewPaddle = (paddle, size, distance, movement) => {
  if (!movement) return paddle
  const direction = movement === MOVEMENT.LEFT ? LEFT : RIGHT
  const { x } = paddle.position.add(direction.scaleBy(distance))
  const withNewX = x => ({
    ...paddle,
    position: new Vector(x, paddle.position.y)
  })
  if (x < 0) {
    return withNewX(0)
  }

  if (x + paddle.width > size.width) {
    return withNewX(size.width - paddle.width)
  }
  return withNewX(x)
}

const isInBoundaries = (oneSide, otherSide, oneBoundary, otherBoundary) => (
  (oneSide >= oneBoundary && oneSide <= otherBoundary) ||
  (otherSide >= oneBoundary && otherSide <= otherBoundary)
)

const getAdjustedVector = (normal, vector, minAngle = 15) => {
  const angle = normal.angleBetween(vector)
  const maxAngle = 90 - minAngle
  if (angle < 0) {
    if (angle > -minAngle) {
      return normal.rotate(-minAngle)
    }
    if (angle < -maxAngle) {
      return normal.rotate(-maxAngle)
    }
  } else {
    if (angle < minAngle) {
      return normal.rotate(minAngle)
    }
    if (angle > maxAngle) {
      return normal.rotate(maxAngle)
    }
  }
  return vector
}

export const getNewGameState = (state, movement, timespan) => {
  let { game, level } = state;
  let { size, lives } = game

  const { ballSpeed, paddleSpeed, bombSpeed, numberOfBombs, numberOfCoins } = getConfigByLevel(level)

  const getDistance = (speed) => {
    return timespan * DISTANCE_IN_MS * speed
  }

  const paddle = getNewPaddle(game.paddle, size, getDistance(paddleSpeed), movement)
  const withDirection = (normal, oldDirection) => {
    const distorted = getDistortedDirection(oldDirection.reflect(normal))
    const direction = getAdjustedVector(normal, distorted)
    return direction
  }

  const paddleLeft = paddle.position.x
  const paddleRight = paddleLeft + paddle.width
  const paddleTop = paddle.position.y
  const paddleBottom = paddle.position.y + paddle.height

  let newBalls = game.balls.map((ball) => {
    const { radius } = ball
    const oldDirection = ball.direction
    const newBallCenter = ball.center.add(oldDirection.scaleBy(getDistance(ballSpeed)))
    const ballBottom = newBallCenter.y + radius
    const ballLeft = newBallCenter.x - radius
    const ballRight = newBallCenter.x + radius
    const ballTop = newBallCenter.y - radius
    const ballGoingDown = Math.abs(UP.angleBetween(oldDirection)) > 90
    const hitPaddle = ballGoingDown && ballBottom >= paddleTop && ballRight >= paddleLeft && ballLeft <= paddleRight && ballTop <= paddleBottom;
    if (hitPaddle || ballBottom > size.width) {
      level = hitPaddle ? level +1 : level
      return getInitialBall(size.width)
    }

    if (ballTop <= 0) return { ...ball, direction: withDirection(DOWN, oldDirection) }
    if (ballLeft <= 0) return { ...ball, direction: withDirection(RIGHT, oldDirection) }
    if (ballRight >= size.width) return { ...ball, direction: withDirection(LEFT, oldDirection) }
    
    return { ...ball, center: newBallCenter }
  })

  let newBombs = game.bombs.map((bomb) => {
    const { radius } = bomb
    const oldDirection = bomb.direction
    const newBombCenter = bomb.center.add(oldDirection.scaleBy(getDistance(bombSpeed)))
    const bombBottom = newBombCenter.y + radius
    const bombLeft = newBombCenter.x - radius
    const bombRight = newBombCenter.x + radius
    const bombTop = newBombCenter.y - radius

    const bombGoingDown = Math.abs(UP.angleBetween(oldDirection)) > 90
    const hitPaddle = bombGoingDown && bombBottom >= paddleTop && bombRight >= paddleLeft && bombLeft <= paddleRight && bombTop <= paddleBottom;
    if (hitPaddle || bombBottom > size.width) {
      lives = hitPaddle ? lives - 1 : lives
      return getInitialBomb(size.width)
    }

    if (bombTop <= 0) return { ...bomb, direction: withDirection(DOWN, oldDirection) }
    if (bombLeft <= 0) return { ...bomb, direction: withDirection(RIGHT, oldDirection) }
    if (bombRight >= size.width) return { ...bomb, direction: withDirection(LEFT, oldDirection) }
    
    return { ...bomb, center: newBombCenter }
  })
  if (newBombs.length < numberOfBombs) {
    newBombs = [...newBombs, ...Array.from(Array(numberOfBombs - newBombs.length)).map(()=> getInitialBomb())]
  }

  if (newBalls.length < numberOfCoins) {
    newBalls = [...newBalls, ...Array.from(Array(numberOfCoins - newBalls.length)).map(()=> getInitialBomb())]
  }
  if (lives <= 0) {
    newBombs = [];
    newBalls = [];
  }
  return { ...state, level, game: { ...game, paddle, balls: newBalls, bombs: newBombs, lives } }
}

