import { random } from "lodash"
import { Observable, filter, delay, concat } from "rxjs"
import { combineEpics } from "redux-observable"
import { playObserve } from "./ouril"


const { zip, interval, merge } = Observable


const nextPlayer = player => player === 0 && 1 || 0


const withInterval = (obs$, amount) => {
  const startTick = Observable.from([1])
  const timing$ = merge(startTick, interval(amount))
  return zip(obs$, timing$, (a) => a)
}


const playerMove = (action$, store) => {
  return action$
    .ofType("PLAY_HOUSE")
    .filter(({ player, house }) => {
      const state = store.getState()
      const isPlayerTurn = player === state.getIn(["currentPlayer"])
      const hasStones = state.getIn(["gameState", "board", player * 6 + house]) !== 0

      return isPlayerTurn && hasStones
    })
    .switchMap(({ player, house }) => {
      const gameState = store.getState().getIn(["gameState"])
      const moves$ = playObserve(gameState, player, house)
      const finalAction = { type: "SWITCH_PLAYER", nextPlayer: nextPlayer(player) }

      return withInterval(moves$, 120)
        .map(([state]) => {
          return { type: "GAME_STATE_CHANGE", state }
        })
        .concat(Observable.of(finalAction))
    })
}


const opponentMove = (action$, store) => {
  return action$
    .ofType("SWITCH_PLAYER")
    .filter(({ nextPlayer }) => nextPlayer === 1)
    .delay(1200)
    .map(() => {
      const houses = store.getState().getIn(["gameState", "board"]).toArray()
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