import React, { useRef, useEffect, useState } from 'react'

import Scene from './scene'
import { registerListener } from '../utils'

export default () => {
  const sceneContainer = useRef()
  const [size, setSize] = useState()
  const [center, setCenter] = useState()

  useEffect(() => {
    const onResize = () => {
      const { left, top, width, height } = sceneContainer.current.getBoundingClientRect()
      setSize({ left, top, width, height })
      const centerX = width / 4
      const centerY = height / 4
      setCenter({
        x: centerX,
        y: centerY
      })
    }
    const unregisterResizeListener = registerListener('resize', onResize)
    onResize()
    return unregisterResizeListener
  }, [])
  console.log(center, size)
  return (
    <div className='page'>
      <div className='scene-container' ref={sceneContainer}>
        {size && <Scene width={size.width} height={size.height} center={center} />}
      </div>
    </div>
  )
}