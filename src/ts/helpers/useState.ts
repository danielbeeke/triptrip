const cache = new Map()

export const useState = (object: object, data: {} = {}) => {
    const key = object
    if (!cache.has(key)) cache.set(key, data)
    return cache.get(key)
}