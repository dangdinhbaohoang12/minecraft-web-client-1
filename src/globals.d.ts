/// <reference types="wicg-file-system-access" />

// todo make optional
declare const bot: Omit<import('mineflayer').Bot, 'world' | '_client'> & {
  world: Omit<import('prismarine-world').world.WorldSync, 'getBlock'> & {
    getBlock: (pos: import('vec3').Vec3) => import('prismarine-block').Block | null
  }
  _client: Omit<import('minecraft-protocol').Client, 'on'> & {
    write: typeof import('./generatedClientPackets').clientWrite
    on: typeof import('./generatedServerPackets').clientOn
  }
}
declare const __type_bot: typeof bot
declare const addStatPerSec: (name: string) => void
declare const localServer: import('flying-squid/dist/index').FullServer & { options } | undefined

// appViewer/mcData/loadedData are also declared as `var` in minecraft-renderer's
// src/three/globals.d.ts, with the EXACT same type text (IndexedData & {sounds}
// for loadedData). Only `var` attaches a property to `typeof globalThis`/
// `window`; `const` does not (matches real JS semantics - `var x` at top level
// creates `window.x`, `const x` doesn't). This file has no top-level
// import/export so it's already a global ambient script; `declare var` here
// applies directly, no `declare global {}` wrapper needed.
//
// Do NOT add fields to IndexedData via `declare module 'minecraft-data'
// { interface IndexedData {...} }` - minecraft-data's real ambient types use
// `export =` semantics, and augmenting from here shadows the real declaration
// instead of merging with it, wiping out every real IndexedData property
// project-wide. Use the intersection type below instead, kept in lockstep
// with the identical type in minecraft-renderer's globals.d.ts.
declare var appViewer: import('minecraft-renderer/src').AppViewer
/** all currently loaded mc data */
declare var mcData: import('minecraft-data').IndexedData
declare var loadedData: import('minecraft-data').IndexedData & { sounds: Record<string, { id: number, name: string }> }

declare const customEvents: import('typed-emitter').default<{
  /** Singleplayer load requested */
  singleplayer (): void
  digStart (): void
  gameLoaded (): void
  mineflayerBotCreated (): void
  search (q: string): void
  activateItem (item: Item, slot: number, offhand: boolean): void
  hurtAnimation (yaw?: number): void
  customChannelRegister (channel: string, parser: any): void
}>
declare const beforeRenderFrame: Array<() => void>
declare const translate: <T extends string | undefined>(key: T) => T

// API LAYER
declare const toggleMicrophoneMuted: undefined | (() => void)
declare const translateText: undefined | ((text: string) => string)

declare interface Document {
  exitPointerLock?(): void
}

declare module '*.frag' {
  const png: string
  export default png
}
declare module '*.vert' {
  const png: string
  export default png
}
declare module '*.wgsl' {
  const png: string
  export default png
}

declare interface Window extends Record<string, any> { }
