import { Observable, filter, delay, concat } from "rxjs"
import { combineEpics } from "redux-observable"

import { playObserve } from "./ouril"
// import aiBot from "./strategies/ai"
import randomBot from "./strategies/random"
import maxBot from "./strategies/max"
import minMaxBot from "./strategies/min-max"
import randomMaxBot from "./strategies/random-max"
import { QueueScheduler } from "rxjs/scheduler/QueueScheduler";


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

      return withInterval(moves$, 140)
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
    .switchMap(({ nextPlayer }) => {
      const gameState = store.getState().getIn(["gameState"])
      return randomBot(gameState, nextPlayer)
    })
    .map((house) => {
      return {
        type: "PLAY_HOUSE",
        player: 1,
        house: house
      }
    })
}


export default combineEpics(playerMove, opponentMove)
