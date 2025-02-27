import { describe, expect, it } from 'vitest'
import { createEmitter } from './emitter'

describe('event emitter', () => {
  it('is empty from the beginning', () => {
    const ee = createEmitter()
    expect(ee.events).toEqual({})
  })

  it('adds listeners', () => {
    const ee = createEmitter()

    ee.on('one', () => true)
    ee.on('two', () => true)
    ee.on('two', () => true)

    expect(Object.keys(ee.events)).toEqual(['one', 'two'])
    expect(ee.events.one?.length).toBe(1)
    expect(ee.events.two?.length).toBe(2)
  })

  it('calls listener', () => {
    const ee = createEmitter()
    const calls: number[][] = []
    ee.on('event', (...args) => {
      calls.push(args)
    })

    ee.emit('event')
    ee.emit('event', 11)
    ee.emit('event', 21, 22)
    ee.emit('event', 31, 32, 33)
    ee.emit('event', 41, 42, 43, 44)

    expect(calls).toEqual([[], [11], [21, 22], [31, 32, 33], [41, 42, 43, 44]])
  })

  it('unbinds listener', () => {
    const ee = createEmitter()

    const calls1: number[] = []
    const unbind = ee.on('event', (a) => {
      calls1.push(a)
    })

    const calls2: number[] = []
    ee.on('event', (a) => {
      calls2.push(a)
    })

    ee.emit('event', 1)
    unbind()
    ee.emit('event', 2)

    expect(calls1).toEqual([1])
    expect(calls2).toEqual([1, 2])
  })

  it('calls unbind after cleaning events', () => {
    const ee = createEmitter()
    const unbind = ee.on('event', () => undefined)
    ee.events = {}
    expect(() => {
      unbind()
    }).not.toThrow()
  })

  it('removes event on no listeners', () => {
    const ee = createEmitter()
    const unbind1 = ee.on('one', () => {})
    const unbind2 = ee.on('one', () => {})

    unbind1()
    expect(ee.events.one?.length).toBe(1)

    unbind1()
    expect(ee.events.one?.length).toBe(1)

    unbind2()
    expect(ee.events.one?.length).toBe(0)

    unbind2()
    expect(ee.events.one?.length).toBe(0)
  })

  it('removes listener during event', () => {
    const ee = createEmitter()

    const calls: number[] = []
    const remove1 = ee.on('event', () => {
      remove1()
      calls.push(1)
    })
    ee.on('event', () => {
      calls.push(2)
    })

    ee.emit('event')
    expect(calls).toEqual([1, 2])
  })

  it('allows to use arrow function to bind a context', () => {
    const ee = createEmitter()
    const app = {
      check: ['a'],

      getListener() {
        return () => {
          this.check = this.value.split('')
        }
      },

      value: 'test',
    }

    const unbind = ee.on('event', app.getListener())

    expect(() => {
      ee.emit('event')
    }).not.toThrow()

    expect(app.check).toEqual(['t', 'e', 's', 't'])

    unbind()
  })

  it('allows to replace listeners', () => {
    const ee1 = createEmitter()
    const ee2 = createEmitter()

    let aCalls = 0
    ee1.on('A', () => {
      aCalls += 1
    })
    let bCalls = 0
    ee2.on('B', () => {
      bCalls += 1
    })

    ee1.events = ee2.events

    ee1.emit('A')
    expect(aCalls).toBe(0)

    ee1.emit('B')
    expect(bCalls).toBe(1)
  })
})
