export const deepMerge = (target, source) => {
  Object.keys(source).forEach(key => {
    if (source[key] instanceof Object && key in target) {
      deepMerge(target[key], source[key])
    } else {
      target[key] = source[key]
    }
  })
  return target
}
