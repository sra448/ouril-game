import { Observable } from "rxjs"
import { times, random } from "lodash"
import { List, Map } from "immutable"
import { writeFile } from "fs"

import play from "./state/ouril"
import randomBot from "./state/strategies/random"
import randomMaxBot from "./state/strategies/random-max"
import maxBot from "./state/strategies/max"
import minMaxBot from "./state/strategies/min-max"


const bot1 = randomMaxBot
const bot2 = randomBot


const nextPlayer = player => player === 0 && 1 || 0


const initGameState = Map({
  board: List([4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]),
  score: List([0, 0]),
  winner: undefined,
  isDraw: false,
  log: List([])
})


const playGame = (state = initGameState, prevPlayer = 1) => {
  if (state.getIn(["winner"]) === undefined
      && state.getIn(["isDraw"]) === false) {

    const player = nextPlayer(prevPlayer)
    const bot = player == 0 ? bot1 : bot2

    return bot(state, player)
      .switchMap((house) => {
        return playGame(play(state, player, house), player)
      })
  } else {
    return new Observable((observer) => {
      observer.next(state)
      observer.complete()
    })
  }
}

var initLog = Map({
  moves: List([]),
  wins: List([0, 0])
})


const log = Observable
  .range(1, 10000)
  .switchMap(() => playGame())
  .reduce((log, finalState) => {
    const logs = finalState.getIn(["log"])
    const winner = finalState.getIn(["winner"])
    console.log(`${winner} won in ${logs.count()} moves`)

    return log
      .updateIn(["wins", winner], x => x + 1)
      .updateIn(["moves"], (moves) => moves.concat(logs))
  }, initLog)
  .subscribe((log) => {
    writeFile("../learning/data.json", JSON.stringify(log.getIn(["moves"])), (err) => {
      if (err) throw err
      console.log(`win distribution: ${log.getIn(["wins"])}`)
      console.log(`average game length: ${log.getIn(["moves"]).count() / 1000}`)
      console.log("logs written")
    })
  })
