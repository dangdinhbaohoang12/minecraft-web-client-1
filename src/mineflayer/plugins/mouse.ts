import { createMouse } from 'mineflayer-mouse'
import { Bot } from 'mineflayer'
import type { Entity } from 'prismarine-entity'
import { Block } from 'prismarine-block'
import { getThreeJsRendererMethods } from 'minecraft-renderer/src/three/threeJsMethods'
import { isGameActive, showModal } from '../../globalState'

import { isCypress } from '../../standaloneUtils'
import { playerState } from '../playerState'
import { sendVideoInteraction, videoCursorInteraction } from '../../customChannels'

function isRideableVehicleEntity (entity?: Entity | null) {
  if (!entity?.name) return false
  return entity.name === 'boat' ||
    entity.name === 'chest_boat' ||
    entity.name === 'minecart' ||
    entity.name.endsWith('_minecart')
}

function cursorBlockDisplay (bot: Bot) {
  const updateCursorBlock = (data?: { block: Block }) => {
    if (!data?.block || bot.game.gameMode === 'spectator') {
      playerState.reactive.lookingAtBlock = undefined
      return
    }

    const { block } = data
    playerState.reactive.lookingAtBlock = {
      x: block.position.x,
      y: block.position.y,
      z: block.position.z,
      shapes: bot.mouse.getBlockCursorShapes(block).map(shape => {
        return bot.mouse.getDataFromShape(shape)
      })
    }
  }

  bot.on('highlightCursorBlock', updateCursorBlock)
  bot.on('game', () => {
    const block = bot.mouse.getCursorState().cursorBlock
    updateCursorBlock(block ? { block } : undefined)
  })

  bot.on('blockBreakProgressStage', (block, stage) => {
    const mergedShape = bot.mouse.getMergedCursorShape(block)
    playerState.reactive.diggingBlock = stage === null ? undefined : {
      x: block.position.x,
      y: block.position.y,
      z: block.position.z,
      stage,
      mergedShape: mergedShape ? bot.mouse.getDataFromShape(mergedShape) : undefined
    }
  })
}

export default (bot: Bot) => {
  bot.loadPlugin(createMouse({
    useMineflayerInteractMethods: false,
  }))

  domListeners(bot)
  cursorBlockDisplay(bot)

  otherListeners()

}
const otherListeners = () => {
  bot.on('startDigging', (block) => {
    customEvents.emit('digStart')
  })

  bot.on('goingToSleep', () => {
    showModal({ reactType: 'bed' })
  })

  bot.on('botArmSwingStart', (hand) => {
    getThreeJsRendererMethods()?.changeHandSwingingState(true, hand === 'left')
  })

  bot.on('botArmSwingEnd', (hand) => {
    getThreeJsRendererMethods()?.changeHandSwingingState(false, hand === 'left')
  })

  bot.on('startUsingItem', (item, slot, isOffhand, duration) => {
    customEvents.emit('activateItem', item, isOffhand ? 45 : bot.quickBarSlot, isOffhand)
    playerState.startUsingItem()
  })

  bot.on('stopUsingItem', () => {
    playerState.stopUsingItem()
  })
}

const domListeners = (bot: Bot) => {
  const abortController = new AbortController()
  let mountInFlight = false
  let mountTimeoutId: NodeJS.Timeout | null = null

  // Clear mount guard when mount completes
  bot.on('mount', () => {
    mountInFlight = false
    if (mountTimeoutId) {
      clearTimeout(mountTimeoutId)
      mountTimeoutId = null
    }
  })

  function handleRightClick() {
    const cursorEntity = bot.mouse.getCursorState().entity
    const isRidingVehicle = Boolean((bot as any).vehicle)
    if (cursorEntity && isRideableVehicleEntity(cursorEntity) && !isRidingVehicle && !mountInFlight) {
      mountInFlight = true
      mountTimeoutId = setTimeout(() => {
        mountInFlight = false
        mountTimeoutId = null
      }, 2000)
      try {
        bot.mount(cursorEntity)
      } catch {
        mountInFlight = false
        if (mountTimeoutId) {
          clearTimeout(mountTimeoutId)
          mountTimeoutId = null
        }
      }
      return
    }
    bot.rightClickStart()
  }

  document.addEventListener('mousedown', (e) => {
    if (e.isTrusted && !document.pointerLockElement && !isCypress()) return
    if (!isGameActive(true)) return

    getThreeJsRendererMethods()?.onPageInteraction()

    const videoInteraction = videoCursorInteraction()
    if (videoInteraction) {
      sendVideoInteraction(videoInteraction.id, videoInteraction.x, videoInteraction.y, e.button === 0)
      return
    }

    const handlers: { [key: number]: () => void } = {
      0: () => bot.leftClickStart(),
      2: handleRightClick,
    }

    const handler = handlers[e.button]
    if (handler) {
      handler()
    }
  }, { signal: abortController.signal })

  document.addEventListener('mouseup', (e) => {
    if (e.button === 0) {
      bot.leftClickEnd()
    } else if (e.button === 2) {
      bot.rightClickEnd()
    }
  }, { signal: abortController.signal })

  bot.mouse.beforeUpdateChecks = () => {
    if (!document.hasFocus() || !isGameActive(true)) {
      // deactive all buttons
      bot.mouse.buttons.fill(false)
    }
  }

  bot.on('end', () => {
    abortController.abort()
  })
}
