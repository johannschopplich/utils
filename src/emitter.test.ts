import type { Emitter, EventHandlerMap } from './emitter'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createEmitter } from './emitter'

describe('event emitter', () => {
  it('accepts an optional event handler map', () => {
    expect(() => createEmitter(new Map())).not.toThrow()

    const map = new Map()
    const a = vi.fn()
    const b = vi.fn()
    map.set('foo', [a, b])
    const events = createEmitter<{ foo: undefined }>(map)
    events.emit('foo')
    expect(a).toHaveBeenCalledTimes(1)
    expect(b).toHaveBeenCalledTimes(1)
  })

  describe('emitter instance', () => {
    const eventType = Symbol('eventType')
    // eslint-disable-next-line ts/consistent-type-definitions
    type Events = {
      'foo': unknown
      'constructor': unknown
      'FOO': unknown
      'bar': unknown
      'Bar': unknown
      'baz:bat!': unknown
      'baz:baT!': unknown
      'Foo': unknown
      [eventType]: unknown
    }
    let events: EventHandlerMap<Events>, inst: Emitter<Events>

    beforeEach(() => {
      events = new Map()
      inst = createEmitter(events)
    })

    describe('properties', () => {
      it('exposes the event handler map', () => {
        expect(inst).toHaveProperty('all')
        expect(inst.all).toBeInstanceOf(Map)
      })
    })

    describe('on()', () => {
      it('registers handler for new type', () => {
        const foo = () => {}
        inst.on('foo', foo)

        expect(events.get('foo')).toEqual([foo])
      })

      it('registers handlers for any type strings', () => {
        const foo = () => {}
        inst.on('constructor', foo)

        expect(events.get('constructor')).toEqual([foo])
      })

      it('appends handler for existing type', () => {
        const foo = () => {}
        const bar = () => {}
        inst.on('foo', foo)
        inst.on('foo', bar)

        expect(events.get('foo')).toEqual([foo, bar])
      })

      it('not normalizes case', () => {
        const foo = () => {}
        inst.on('FOO', foo)
        inst.on('Bar', foo)
        inst.on('baz:baT!', foo)

        expect(events.get('FOO')).toEqual([foo])
        expect(events.has('foo')).toBe(false)
        expect(events.get('Bar')).toEqual([foo])
        expect(events.has('bar')).toBe(false)
        expect(events.get('baz:baT!')).toEqual([foo])
      })

      it('takes symbols for event types', () => {
        const foo = () => {}
        inst.on(eventType, foo)
        expect(events.get(eventType)).toEqual([foo])
      })

      it('adds duplicate listeners', () => {
        const foo = () => {}
        inst.on('foo', foo)
        inst.on('foo', foo)
        expect(events.get('foo')).toEqual([foo, foo])
      })
    })

    describe('off()', () => {
      it('removes handler for type', () => {
        const foo = () => {}
        inst.on('foo', foo)
        inst.off('foo', foo)

        expect(events.get('foo')).toEqual([])
      })

      it('not normalizes case', () => {
        const foo = () => {}
        inst.on('FOO', foo)
        inst.on('Bar', foo)
        inst.on('baz:bat!', foo)

        inst.off('FOO', foo)
        inst.off('Bar', foo)
        inst.off('baz:baT!', foo)

        expect(events.get('FOO')).toEqual([])
        expect(events.has('foo')).toBe(false)
        expect(events.get('Bar')).toEqual([])
        expect(events.has('bar')).toBe(false)
        expect(events.get('baz:bat!')).toHaveLength(1)
      })

      it('removes only the first matching listener', () => {
        const foo = () => {}
        inst.on('foo', foo)
        inst.on('foo', foo)
        inst.off('foo', foo)
        expect(events.get('foo')).toEqual([foo])
        inst.off('foo', foo)
        expect(events.get('foo')).toEqual([])
      })

      it('removes all handlers of the given type', () => {
        inst.on('foo', () => {})
        inst.on('foo', () => {})
        inst.on('bar', () => {})
        inst.off('foo')
        expect(events.get('foo')).toEqual([])
        expect(events.get('bar')).toHaveLength(1)
        inst.off('bar')
        expect(events.get('bar')).toEqual([])
      })
    })

    describe('emit()', () => {
      it('invokes handler for type', () => {
        const event = { a: 'b' }
        const handler = vi.fn()

        inst.on('foo', handler)
        inst.emit('foo', event)

        expect(handler).toHaveBeenCalledWith(event)
        expect(handler).toHaveBeenCalledTimes(1)
      })

      it('not ignores case', () => {
        const onFoo = vi.fn()
        const onFOO = vi.fn()
        events.set('Foo', [onFoo])
        events.set('FOO', [onFOO])

        inst.emit('Foo', 'Foo arg')
        inst.emit('FOO', 'FOO arg')

        expect(onFoo).toHaveBeenCalledTimes(1)
        expect(onFoo).toHaveBeenCalledWith('Foo arg')
        expect(onFOO).toHaveBeenCalledTimes(1)
        expect(onFOO).toHaveBeenCalledWith('FOO arg')
      })

      it('invokes * handlers', () => {
        const star = vi.fn()
        const ea = { a: 'a' }
        const eb = { b: 'b' }

        events.set('*', [star])

        inst.emit('foo', ea)
        expect(star).toHaveBeenCalledTimes(1)
        expect(star).toHaveBeenCalledWith('foo', ea)

        star.mockClear()

        inst.emit('bar', eb)
        expect(star).toHaveBeenCalledTimes(1)
        expect(star).toHaveBeenCalledWith('bar', eb)
      })
    })
  })
})
