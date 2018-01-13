import { times, random } from "lodash"
import { List, Map } from "immutable"
import { writeFile } from "fs"

import play from "./state/ouril"
import randomBot from "./state/strategies/random"
import maxBot from "./state/strategies/max"


const nextPlayer = player => player === 0 && 1 || 0


const playGame = () => {
  var player = 1
  var state = Map({
    board: List([4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]),
    score: List([0, 0]),
    winner: undefined,
    isDraw: false,
    log: List([])
  })

  while (state.getIn(["winner"]) === undefined && state.getIn(["isDraw"]) === false) {
    player = nextPlayer(player)
    const house = player == 0 ? maxBot(state, player) : randomBot(state, player)
    state = play(state, player, house)
  }

  return state
}

var initLog = Map({
  moves: List([]),
  wins: List([0, 0])
})

const log = times(1000)
  .reduce((log, i) => {
    const finalState = playGame()
    const logs = finalState.getIn(["log"])
    const winner = finalState.getIn(["winner"])

    console.log(`${i} => ${winner} won in ${logs.count()} moves`)
    return log
      .updateIn(["wins", winner], x => x + 1)
      .updateIn(["moves"], (moves) => moves.concat(logs))
  }, initLog)


writeFile("data.json", JSON.stringify(log.getIn("moves")), (err) => {
  if (err) throw err
  console.log(`win distribution: ${log.getIn(["wins"])}`)
  console.log(`average game length: ${log.getIn(["moves"]).count() / 1000}`)
  console.log("logs written")
})
