// global variables useful for debugging

import fs from 'fs'
import { WorldRendererThree } from 'minecraft-renderer/src/three/worldRendererThree'
import { enable, disable, enabled } from 'debug'
import { Vec3 } from 'vec3'

customEvents.on('mineflayerBotCreated', () => {
  window.debugServerPacketNames = Object.fromEntries(Object.keys(loadedData.protocol.play.toClient.types).map(name => {
    name = name.replace('packet_', '')
    return [name, name]
  }))
  window.debugClientPacketNames = Object.fromEntries(Object.keys(loadedData.protocol.play.toServer.types).map(name => {
    name = name.replace('packet_', '')
    return [name, name]
  }))
})

window.Vec3 = Vec3
window.cursorBlockRel = (x = 0, y = 0, z = 0) => {
  if (!window.holdingBlock) return undefined
  return [window.holdingBlock.position.x - x, window.holdingBlock.position.y - y, window.holdingBlock.position.z - z] as const
}

Object.defineProperty(window, 'debug', {
  get () {
    if (enabled('*')) {
      disable()
      return 'disabled debug'
    } else {
      enable('*')
      return 'enabled debug'
    }
  },
  set (v) {
    enable(v)
    localStorage.debug = v
    console.log('Enabled debug for', v)
  }
})

customEvents.on('gameLoaded', () => {
  window.holdingBlock = window.world?.holdingBlock
})

window.clearStorage = (...keysToKeep: string[]) => {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && !keysToKeep.includes(key)) {
      localStorage.removeItem(key)
    }
  }
  return `Cleared ${localStorage.length - keysToKeep.length} items from localStorage. Kept: ${keysToKeep.join(', ')}`
}
