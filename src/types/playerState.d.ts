declare module 'minecraft-renderer/src/playerState/playerState' {
  interface PlayerStateReactive {
    /** When set, local player is mounted on an entity */
    riding?: {
      mountEntityId: number
    }
  }
}
