import React, { useRef, useEffect, useState } from 'react'
import { useWeb3React } from "@web3-react/core"
import { connectors } from "../wallet/Connector"

import Scene from './scene'
import { registerListener, truncateEthAddress } from '../utils'
import { Leaderboard } from './leaderboard'
import axios from 'axios'
import SelectWalletModal from './select-model'

export default () => {
  const sceneContainer = useRef()
  const [size, setSize] = useState()
  const [center, setCenter] = useState()
  const [start, setStart] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const { active, account, connector, activate, deactivate } = useWeb3React()

  async function connect() {
    try {
      await activate(connectors.injected)
    } catch (ex) {
      console.log(ex)
    }
  }

  async function disconnect() {
    try {
      deactivate()
    } catch (ex) {
      console.log(ex)
    }
  }

  useEffect(() => {
    if (account) {
      axios.get(`${process.env.REACT_APP_BASE_URL}/add-account?account=${account}`).then(console.log)
    }
  }, [account])


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

  useEffect(() => {
    const unregisterResizeListener = registerListener('resize', onResize)
    onResize()

    return unregisterResizeListener
  }, [])

  useEffect(() => onResize(), [start])


  return (
    <div className='page'>
      {!start &&(
        <div className={`flex-1 flex items-center justify-center flex-col`}>
          <div className='sm:w-full md:w-1/3 m-2'>
            <Leaderboard start={start} />
            <button className='my-2 w-full border-2 border-sky-500 hover:bg-sky-700 text-sky-500 hover:text-white-500 font-bold py-2 px-4 rounded' onClick={() => active ? disconnect() : setIsOpen(true)}> 
              {!active ? 'Connect to wallet' : `Connected with ${truncateEthAddress(account)}`}
            </button>
            <button disabled={!active} className={`w-full bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded ${!active ? 'bg-gray-400  hover:bg-gray-700' : ''}`} onClick={() => setStart(true)}> 
              Start Game
            </button>
          </div>
        </div>
      )}
      <SelectWalletModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <div className={`${!start ? 'hidden' : 'visible'} w-full h-full`} ref={sceneContainer}>
        {size && size.width && size.height && start && <Scene start={start} width={size.width} height={size.height} center={center} onGameStateChange={setStart} />}
      </div>
    </div>
  )
}