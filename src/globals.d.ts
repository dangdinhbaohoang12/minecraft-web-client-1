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

// `sounds` is consumed by chat/UI code; augmenting IndexedData directly (rather
// than intersecting it locally) means every `IndexedData` reference - including
// the one inside minecraft-renderer's own src/three/globals.d.ts - sees the same
// shape. minecraft-renderer declares this same augmentation for its own
// standalone build; keep both declarations identical if either changes.
declare module 'minecraft-data' {
  interface IndexedData {
    sounds: Record<string, { id: number, name: string }>
  }
}

// appViewer/mcData/loadedData are also declared as `var` (not `const`) in
// minecraft-renderer's src/three/globals.d.ts, with IDENTICAL types. Only
// `var` attaches a property to `typeof globalThis`/`window`; `const` does
// not (this matches real JS semantics). This file has no top-level
// import/export, so it's a global ambient script already - these `var`
// declarations apply directly without a `declare global {}` wrapper (that
// wrapper is only valid, and only needed, inside module files). TypeScript
// requires globals declared in multiple files/packages to have the exact
// same type or it errors - keep this block and the renderer's in lockstep.
declare var appViewer: import('minecraft-renderer/src').AppViewer
/** all currently loaded mc data */
declare var mcData: import('minecraft-data').IndexedData
declare var loadedData: import('minecraft-data').IndexedData

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
