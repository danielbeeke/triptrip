const cache = new Map()

export const useEffect = (givenEffect: Function) => {
    const key = givenEffect.toString()
    if (!cache.has(key)) cache.set(key, givenEffect())
    return cache.get(key)
}