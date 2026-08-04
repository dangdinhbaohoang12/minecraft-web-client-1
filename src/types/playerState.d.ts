import type { GameMode } from 'mineflayer'
import type { Team } from 'minecraft-protocol'

declare module 'minecraft-renderer/src/playerState/playerState' {
  interface PlayerStateReactive {
    riding?: { mountEntityId: number }
    perspective: 'first_person' | 'third_person_back' | 'third_person_front'
    fovMultiplier: number
    username: string
    onlineMode: boolean
    gameMode?: GameMode
    team?: Team
    eyeHeight: number
    inWater: boolean
    waterBreathing: boolean
    sneaking: boolean
    flying: boolean
    sprinting?: boolean
    movementState?: { walking: boolean; sprinting: boolean; sneaking: boolean }
    walkDist: number
    prevWalkDist: number
    bob: number
    prevBob: number
    heldItemMain?: { name: string; [key: string]: any }
    heldItemOff?: { name: string; [key: string]: any }
    itemUsageTicks: number
    backgroundColor: [number, number, number]
    ambientLight: number
    directionalLight: number
    lightingDisabled: boolean
    cardinalLight: 'default' | 'north' | 'south' | 'east' | 'west'
    playerSkin?: string
    lookingAtBlock?: { position: [number, number, number]; face: number }
    diggingBlock?: { position: [number, number, number] }
    spectatorTarget?: number
  }
  
  interface PlayerStateRenderer { reactive: PlayerStateReactive }
  interface PlayerStateUtils { isSpectatingEntity: () => boolean; [key: string]: any }
  function getInitialPlayerState(): Partial<PlayerStateReactive>
  function getPlayerStateUtils(reactive: PlayerStateReactive): PlayerStateUtils
  function getItemSelector(reactive: PlayerStateReactive): any
}
