import { random } from "lodash"
import { filter, delay } from "rxjs"


export default (action$, store) => {
  return action$.ofType("PLAY_HOUSE")
    .filter(({ player }) => player == 0)
    .delay(800)
    .map(() => {
      const houses = store.getState().getIn(["board"]).toArray()
      const possibleHouses = [6, 7, 8, 9, 10, 11].reduce((acc, x, i) => {
        if (houses[i] !== 0) {
          return [...acc, i]
        } else {
          return acc
        }
      }, [])

      return {
        type: "PLAY_HOUSE",
        player: 1,
        house: possibleHouses[random(possibleHouses.length - 1)]
      }
    })
}