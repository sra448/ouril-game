import { random } from "lodash"
import play from "../ouril"


export default (state, player) => {
  const houses = state.getIn(["board"]).toArray()

  const possibleHouses = [0, 1, 2, 3, 4, 5].reduce((acc, x, i) => {
    if (houses[player * 6 + i] !== 0) {
      return [...acc, i]
    } else {
      return acc
    }
  }, [])

  const maxHouses = possibleHouses.reduce(([ids, score], house) => {
    const newState = play(state, player, house)
    const newScore = newState.getIn(["score", player]) - state.getIn(["score", player])

    if (newScore > score) {
      return [[house], newScore]
    } else if (newScore == score) {
      return [[...ids, house], newScore]
    } else {
      return [ids, score]
    }
  }, [[], -99])[0]

  return maxHouses[random(maxHouses.length - 1)]
}