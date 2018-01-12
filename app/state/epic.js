import { random } from "lodash"
import { Observable, filter, delay } from "rxjs"
import { combineEpics } from "redux-observable"
import { playObserve } from "./ouril"


const nextPlayer = player => player === 0 && 1 || 0


const playHouse = (state, player, house) => {
  if (player === state.getIn(["currentPlayer"])) {
    return play(state, player, house)
      .setIn(["currentPlayer"], nextPlayer(player))
  } else {
    return state
  }
}


const playerMove = (action$, store) => {
  return action$
    .ofType("PLAY_HOUSE")
    .switchMap(({ player, house }) => {
      return Observable.zip(Observable.interval(160), playObserve(store.getState(), player, house), (_, x) => x)
    })
    .map(([state, ...rest]) => {
      return { type: "RENDER", state }
    })
}


const opponentMove = (action$, store) => {
  return action$.ofType("PLAY_HOUSE")
    .filter(({ player }) => player == 0)
    .delay(2000)
    .map(() => {
      const houses = store.getState().getIn(["board"]).toArray()
      const possibleHouses = [6, 7, 8, 9, 10, 11].reduce((acc, x, i) => {
        if (houses[x] !== 0) {
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


export default combineEpics(playerMove, opponentMove)