const toString = (v: unknown) => Object.prototype.toString.call(v)

export const isObject = (value: unknown): value is Record<any, any> => toString(value) === '[object Object]'
