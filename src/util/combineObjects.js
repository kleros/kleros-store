// We want to combine object such that { key: undefined } is replaced by { key: value }
export const combineObjects = (immutableObj, newObj) => {
  for (let property in newObj) {
    if (newObj.hasOwnProperty(property)) {
      if (!immutableObj[property]) {
        immutableObj[property] = newObj[property]
      }
    }
  }

  return immutableObj
}
