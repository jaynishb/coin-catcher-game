import React, { useEffect, useMemo, useReducer, useState } from 'react'
import axios from "axios";

import { MOVEMENT, getNewGameState, getGameStateFromLevel, BALL_RADIUS, getConfigByLevel } from '../game/core'
import { registerListener } from '../utils'

import Level from './level'
import Paddle from './paddle'
import Ball from './ball'
import Bomb from './bomb'
import Lives from './lives'
import GameOver from './game-over'
import Vector from '../game/vector'
import { useWeb3React } from '@web3-react/core';

const MOVEMENT_KEYS = {
  LEFT: [65, 37],
  RIGHT: [68, 39]
}

const MOVEMENT_DIRECTION = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT'
}

const STOP_KEY = 32

const UPDATE_EVERY = 1000 / 60

const getInitialLevel = () => {
  const inState = localStorage.getItem('level')
  return inState ? parseInt(inState, 10) : 0
}

const getProjectors = (containerSize, gameSize) => {
  const widthRatio = (containerSize.width / gameSize.width) * 2
  const heightRatio = (containerSize.height / gameSize.height)
  const unitOnScreen = Math.min(widthRatio, heightRatio)

  return {
    projectDistance: distance => distance * unitOnScreen,
    projectVector: vector => {
      return vector.scaleBy(unitOnScreen)
    }
  }
}

const getInitialState = containerSize => {
  const level = getInitialLevel()
  const game = getGameStateFromLevel(getConfigByLevel(level), containerSize)
  const { projectDistance, projectVector } = getProjectors(containerSize, game.size)
  return {
    level,
    game,
    containerSize,
    projectDistance,
    projectVector,
    time: Date.now(),
    stopTime: undefined,
    movement: undefined
  }
}

const ACTION = {
  CONTAINER_SIZE_CHANGE: 'CONTAINER_SIZE_CHANGE',
  KEY_DOWN: 'KEY_DOWN',
  KEY_UP: 'KEY_UP',
  TICK: 'TICK',
  PADDEL_MOVE: 'PADDEL_MOVE',
  PADDEL_STOP: 'PADDEL_STOP'
}

const HANDLER = {
  [ACTION.CONTAINER_SIZE_CHANGE]: (state, containerSize) => ({
    ...state,
    containerSize,
    ...getProjectors(containerSize, state.game.size)
  }),
  [ACTION.KEY_DOWN]: (state, key) => {
    if (MOVEMENT_KEYS.LEFT.includes(key)) {
      return { ...state, movement: MOVEMENT.LEFT }
    } else if (MOVEMENT_KEYS.RIGHT.includes(key)) {
      return { ...state, movement: MOVEMENT.RIGHT }
    }
    return state
  },
  [ACTION.PADDEL_MOVE]: (state, direction) => {
    if (MOVEMENT_DIRECTION.LEFT === direction) {
      return { ...state, movement: MOVEMENT.LEFT }
    } else if (MOVEMENT_DIRECTION.RIGHT === direction) {
      return { ...state, movement: MOVEMENT.RIGHT }
    }
    return state
  },
  [ACTION.PADDEL_STOP]: (state) => {
    const newState = { ...state, movement: undefined }
    return newState
  },
  [ACTION.KEY_UP]: (state, key) => {
    const newState = { ...state, movement: undefined }
    if (key === STOP_KEY) {
      if (state.stopTime) {
        return { ...newState, stopTime: undefined, time: state.time + Date.now() - state.stopTime }
      } else {
        return { ...newState, stopTime: Date.now() }
      }
    }
    return newState
  },
  [ACTION.TICK]: state => {
    if (state.stopTime) return state

    const time = Date.now()
    const { game: newGame, level } = getNewGameState(state, state.movement, time - state.time)
    const newState = { ...state, level, time }
    return { ...newState, game: newGame }
  },

  [ACTION.RESTART]: (state, containerSize) => {
    return { ...getInitialState(containerSize) }
  },
}

const reducer = (state, { type, payload }) => {
  const handler = HANDLER[type]
  if (!handler) return state
  return handler(state, payload)
}

export default (containerSize) => {
  // const { onGameStateChange, start, ...containerSize } = props;
  const { account } = useWeb3React()
  const [state, dispatch] = useReducer(reducer, containerSize, getInitialState)
  const [timerId, setTimerId] = useState();
  const act = (type, payload) => dispatch({ type, payload })
  const {
    projectDistance,
    projectVector,
    level,
    game: {
      paddle,
      balls,
      bombs,
      size: {
        width,
        height
      },
      lives
    }
  } = state

  useEffect(() => act(ACTION.CONTAINER_SIZE_CHANGE, containerSize), [containerSize])

  const movePaddel = (direction) => act(ACTION.PADDEL_MOVE, direction)
  const stopPaddel = () => act(ACTION.PADDEL_STOP)

  useEffect(() => {
    const onKeyDown = ({ which }) => act(ACTION.KEY_DOWN, which)
    const onKeyUp = ({ which }) => act(ACTION.KEY_UP, which)
    const tick = () => act(ACTION.TICK)

    const intervalId = setInterval(tick, UPDATE_EVERY)
    setTimerId(intervalId)
    const unregisterKeydown = registerListener('keydown', onKeyDown)
    const unregisterKeyup = registerListener('keyup', onKeyUp)
    return () => {
      clearInterval(intervalId)
      unregisterKeydown()
      unregisterKeyup()
    }
  }, [])

  const restart = (containerSize) => act(ACTION.GAME_OVER,containerSize)
  const viewWidth = projectDistance(width)
  const unit = projectDistance(BALL_RADIUS)

  const isGameOver = useMemo(() => lives <= 0, [lives]);

  const updateScore = () => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/score-save?account=${account}&score=${level}`).then(console.log);
  }

  useEffect(() => {
    if (isGameOver) {
      updateScore()
      setTimeout(() => {
        containerSize.onGameStateChange(false)
      }, 2000)
      clearInterval(timerId)
    }
  }, [isGameOver])

  const onTap = (e) => {  
    const { changedTouches } = e;
    const [touched] = changedTouches;

    const centerX = containerSize.width /2;

    const direction = touched.clientX > centerX ? MOVEMENT_DIRECTION.RIGHT : MOVEMENT_DIRECTION.LEFT

    movePaddel(direction)
  }

  return (
    <div style={{ 
      backgroundImage: `url("https://images.pexels.com/photos/3772336/pexels-photo-3772336.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover'
    }}>
    <svg onTouchStart={onTap} onTouchEnd={stopPaddel} width={'100%'} height={'100vh'} className='scene'>

      <Level unit={unit} level={level} />
      {!isGameOver && <Lives containerWidth={viewWidth} unit={unit} lives={lives} />}
      {isGameOver && <GameOver {...new Vector(containerSize.center.x, containerSize.center.y)} />}
      <Paddle width={projectDistance(paddle.width)} height={projectDistance(paddle.height)} {...projectVector(paddle.position)} />
      {!isGameOver && balls.map((ball, index) => <Ball key={index} {...projectVector(ball.center)} radius={unit} />)}
      {!isGameOver && bombs.map((bomb, index) => <Bomb key={index} {...projectVector(bomb.center)} radius={unit} />)}
    </svg>
    </div>
  )
}