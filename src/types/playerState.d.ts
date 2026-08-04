declare module 'minecraft-renderer/src/playerState/playerState' {
  export interface PlayerStateReactive {
    /** When set, local player is mounted on an entity */
    riding?: {
      mountEntityId: number
    }
  }
}
