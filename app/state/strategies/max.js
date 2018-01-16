import { Observable } from "rxjs"
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

  return new Observable((observer) => {
    observer.next(possibleHouses.reduce(([id, score], house) => {
      const newState = play(state, player, house)
      const newScore = newState.getIn(["score", player]) - state.getIn(["score", player])
      return newScore >= score ? [house, newScore] : [id, score]
    }, [undefined, -99])[0])
    observer.complete()
  })
}