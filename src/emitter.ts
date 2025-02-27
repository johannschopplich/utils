interface EventsMap {
  [event: string]: any
}

interface DefaultEvents extends EventsMap {
  [event: string]: (...args: any) => void
}

interface Unsubscribe {
  (): void
}

export interface Emitter<Events extends EventsMap = DefaultEvents> {
  /**
   * Calls each of the listeners registered for a given event.
   *
   * @example
   * emitter.emit('tick', tickType, tickDuration)
   *
   * @param event The event name.
   * @param args The arguments for listeners.
   */
  emit: <K extends keyof Events>(
    this: this,
    event: K,
    ...args: Parameters<Events[K]>
  ) => void

  /**
   * Event names in keys and arrays with listeners in values.
   *
   * @example
   * emitter1.events = emitter2.events
   * emitter2.events = { }
   */
  events: Partial<{ [E in keyof Events]: Events[E][] }>

  /**
   * Add a listener for a given event.
   *
   * @example
   * const unbind = emitter.on('tick', (tickType, tickDuration) => {
   *   count += 1
   * })
   *
   * disable () {
   *   unbind()
   * }
   *
   * @param event The event name.
   * @param cb The listener function.
   * @returns Unbind listener from event.
   */
  on: <K extends keyof Events>(this: this, event: K, cb: Events[K]) => Unsubscribe
}

/**
 * Create event emitter.
 *
 * @example
 * import { createEmitter } from 'nanoevents'
 *
 * class Ticker {
 *   constructor() {
 *     this.emitter = createEmitter()
 *   }
 *   on(...args) {
 *     return this.emitter.on(...args)
 *   }
 *   tick() {
 *     this.emitter.emit('tick')
 *   }
 * }
 *
 * @remarks Ported from `nanoevents`.
 * @see https://github.com/ai/nanoevents
 */
export function createEmitter<
  Events extends EventsMap = DefaultEvents,
>(): Emitter<Events> {
  return ({
    emit(event, ...args) {
      for (
        let callbacks = this.events[event] || [],
          i = 0,
          length = callbacks.length;
        i < length;
        i++
      ) {
        callbacks[i](...args)
      }
    },
    events: {},
    on(event, cb) {
      ;(this.events[event] ||= []).push(cb)
      return () => {
        this.events[event] = this.events[event]?.filter(i => cb !== i)
      }
    },
  })
}
