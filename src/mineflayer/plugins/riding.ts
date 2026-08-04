import type { Bot } from 'mineflayer'
import { playerState } from '../playerState'
import { getThreeJsRendererMethods } from 'minecraft-renderer/src/three/threeJsMethods'

// Helper: compare passenger list to see if local player is included
function isLocalPlayerInPassengers (bot: Bot, passengers: any): boolean {
  try {
    const myId = (bot.entity as any)?.id
    if (myId == null) return false
    if (Array.isArray(passengers)) return passengers.includes(myId)
    return false
  } catch {
    return false
  }
}

export default (bot: Bot) => {
  const client = (bot as any)._client
  if (!client) return

  client.on('set_passengers', (packet: any) => {
    try {
      const { entityId, passengers } = packet
      const iAmPassenger = isLocalPlayerInPassengers(bot, passengers)
      const wasRiding = !!playerState.reactive.riding

      if (iAmPassenger && !wasRiding) {
        // Player mounted
        playerState.reactive.riding = { mountEntityId: entityId }
        getThreeJsRendererMethods()?.setRidingState?.(true, entityId)
      } else if (!iAmPassenger && wasRiding && playerState.reactive.riding?.mountEntityId === entityId) {
        // Player unmounted from this entity
        playerState.reactive.riding = undefined
        getThreeJsRendererMethods()?.setRidingState?.(false)
      } else {
        // Other players mounting/unmounting
        getThreeJsRendererMethods()?.updateEntityPassengers?.(entityId, passengers)
      }
    } catch (err) {
      console.warn('riding: failed to handle set_passengers', err)
    }
  })

  client.on('vehicle_move', (packet: any) => {
    try {
      getThreeJsRendererMethods()?.onVehicleMove?.(packet)
    } catch (err) {
      console.warn('riding: failed to handle vehicle_move', err)
    }
  })

  client.on('attach_entity', (packet: any) => {
    try {
      const { entityId, vehicleId } = packet
      if ((bot.entity as any)?.id === entityId) {
        if (vehicleId != null && vehicleId !== -1) {
          playerState.reactive.riding = { mountEntityId: vehicleId }
          getThreeJsRendererMethods()?.setRidingState?.(true, vehicleId)
        } else {
          playerState.reactive.riding = undefined
          getThreeJsRendererMethods()?.setRidingState?.(false)
        }
      } else {
        getThreeJsRendererMethods()?.updateEntityPassengers?.(vehicleId, [entityId])
      }
    } catch (err) {
      console.warn('riding: failed to handle attach_entity', err)
    }
  })
}
