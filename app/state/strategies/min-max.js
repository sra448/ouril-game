import { random } from "lodash"
import play from "../ouril"
import { max } from "rxjs/operators/max";


const nextPlayer = player => player === 0 && 1 || 0


const possibleHouses = (houses, player) => {
  return [0, 1, 2, 3, 4, 5].reduce((acc, x, i) => {
    if (houses[player * 6 + i] !== 0) {
      return [...acc, i]
    } else {
      return acc
    }
  }, [])
}


const lookAhead = (state, player) => {
  const houses = state.getIn(["board"]).toArray()

  return possibleHouses(houses, player)
    .reduce(([id, score], house) => {
      const newState = play(state, player, house)
      const newScore = newState.getIn(["score", player]) - state.getIn(["score", player])

      return newScore >= score ? [house, newScore] : [id, score]
    }, [undefined, -99])[1]
}


export default (state, player) => {
  const houses = state.getIn(["board"]).toArray()

  return possibleHouses(houses, player).reduce(([id, score], house) => {
    const newState = play(state, player, house)
    const newScore = newState.getIn(["score", player]) - state.getIn(["score", player])
    const maxOpponentScore = lookAhead(newState, nextPlayer(player))
    const deltaScore = newScore - maxOpponentScore

    return deltaScore >= score ? [house, newScore] : [id, score]
  }, [undefined, -99])[0]
}