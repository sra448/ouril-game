import { Observable } from "rxjs"
import { random } from "lodash"


export default (state, player) => {
  return new Observable((observer) => {
    const houses = state.getIn(["board"]).toArray()

    const possibleHouses = [0, 1, 2, 3, 4, 5].reduce((acc, x, i) => {
      if (houses[player * 6 + i] !== 0) {
        return [...acc, i]
      } else {
        return acc
      }
    }, [])

    observer.next(possibleHouses[random(possibleHouses.length - 1)])
    observer.complete()
  })
}