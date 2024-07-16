const toString = (value: unknown) => Object.prototype.toString.call(value)

export const isObject = (value: unknown): value is Record<any, any> => toString(value) === '[object Object]'
