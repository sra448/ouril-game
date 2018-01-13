import { random } from "lodash"


export default (state, player) => {
  const houses = state.getIn(["board"]).toArray()

  const possibleHouses = [0, 1, 2, 3, 4, 5].reduce((acc, x, i) => {
    if (houses[player * 6 + i] !== 0) {
      return [...acc, i]
    } else {
      return acc
    }
  }, [])

  return possibleHouses[random(possibleHouses.length - 1)]
}