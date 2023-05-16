import Vector from './vector'
import { flatten, getRandomFrom, withoutElement, updateElement, randomRange } from '../utils'
import { BombLevel } from './levels'

const BLOCK_HEIGHT = 5
const PADDLE_AREA = 1 / 3
const PADDLE_HEIGHT = BLOCK_HEIGHT
export const BALL_RADIUS = 1
const DISTANCE_IN_MS = 0.02
export const WIND = 0.0005

export const MOVEMENT = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT'
}

const LEFT = new Vector(-1, 0)
const RIGHT = new Vector(1, 0)
const UP = new Vector(0, -1)
const DOWN = new Vector(0, 1)

const LEFT_UP = LEFT.add(UP).normalize()
const RIGHT_UP = RIGHT.add(UP).normalize()
const RIGHT_DOWN = RIGHT.add(DOWN).normalize()

export const getInitialPaddleAndBall = (width, height, paddleWidth) => {
  const paddleY = height - PADDLE_HEIGHT
  const paddle = {
    position: new Vector((width - paddleWidth) , paddleY),
    width: paddleWidth,
    height: PADDLE_HEIGHT
  }
  const balls = Array.from(Array(3)).map(()=>({
    center: new Vector(randomRange(10, width -10), 5),
    radius: BALL_RADIUS,
    direction: DOWN
  }))

  const bombs = Array.from(Array(0)).map(()=>({
    center: new Vector(randomRange(10, width -10), 5),
    radius: BALL_RADIUS,
    direction: DOWN
  }))

  return {
    paddle,
    balls,
    bombs
  }
}

const getInitialBall = (width) => {
  return {
    center: new Vector(randomRange(10, width -10), 5),
    radius: BALL_RADIUS,
    direction: DOWN
  }
}

const getInitialBomb = (width) => {
  return {
    center: new Vector(randomRange(10, width -10), 5),
    radius: BALL_RADIUS,
    direction: DOWN
  }
}

export const getGameStateFromLevel = ({ lives, paddleWidth, speed }, containerSize) => {

  const size = {
    width: Math.ceil(containerSize.width / 20) + 1,
    height: Math.ceil(containerSize.height / 20)
  }
  return {
    size,
    ...getInitialPaddleAndBall(size.width, size.height, paddleWidth),
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
  let { size, speed, lives } = game
  const distance = timespan * DISTANCE_IN_MS * speed
  const paddle = getNewPaddle(game.paddle, size, distance, movement)
  const withDirection = (normal, oldDirection) => {
    const distorted = getDistortedDirection(oldDirection.reflect(normal))
    const direction = getAdjustedVector(normal, distorted)
    return direction
  }

  const paddleLeft = paddle.position.x
  const paddleRight = paddleLeft + paddle.width
  const paddleTop = paddle.position.y


  let newBalls = game.balls.map((ball) => {
    const { radius } = ball
    const oldDirection = ball.direction
    const newBallCenter = ball.center.add(oldDirection.scaleBy(distance))
    const ballBottom = newBallCenter.y + radius
    const ballLeft = newBallCenter.x - radius
    const ballRight = newBallCenter.x + radius
    const ballTop = newBallCenter.y - radius
    const ballGoingDown = Math.abs(UP.angleBetween(oldDirection)) > 90
    const hitPaddle = ballGoingDown && ballBottom >= paddleTop && ballRight >= paddleLeft && ballLeft <= paddleRight;

    if (hitPaddle || ballBottom > size.width) {
      level = hitPaddle ? level +1 : level
      return getInitialBall(size.width)
    }

    if (ballTop <= 0) return { ...ball, direction: withDirection(DOWN, oldDirection) }
    
    return { ...ball, center: newBallCenter }
  })

  let newBombs = game.bombs.map((bomb) => {
    const { radius } = bomb
    const oldDirection = bomb.direction
    const newBombCenter = bomb.center.add(oldDirection.scaleBy(distance))
    const bombBottom = newBombCenter.y + radius
    const bombLeft = newBombCenter.x - radius
    const bombRight = newBombCenter.x + radius
    const bombTop = newBombCenter.y - radius

    const bombGoingDown = Math.abs(UP.angleBetween(oldDirection)) > 90
    const hitPaddle = bombGoingDown && bombBottom >= paddleTop && bombRight >= paddleLeft && bombLeft <= paddleRight;

    if (hitPaddle || bombBottom > size.width) {
      lives = hitPaddle ? lives - 1 : lives
      return getInitialBomb(size.width)
    }

    if (bombTop <= 0) return { ...bomb, direction: withDirection(DOWN, oldDirection) }
    
    return { ...bomb, center: newBombCenter }
  })

  let requiredBombs = 0;

  Object.keys(BombLevel).reverse().map((bombLevel) => {
    if (level > +bombLevel) {
      requiredBombs = BombLevel[bombLevel];
    }
  })

  if (newBombs.length < requiredBombs) {
    newBombs = [...newBombs, ...Array.from(Array(requiredBombs - newBombs.length)).map(()=> getInitialBomb())]
  }

  if (lives <= 0) {
    newBombs = [];
    newBalls = [];
  }

  return { ...state, level, game: { ...game, paddle, balls: newBalls, bombs: newBombs, lives } }
}

