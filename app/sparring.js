import { times, random } from "lodash"
import { List, Map } from "immutable"
import { writeFile } from "fs"

import play from "./state/ouril"
import randomBot from "./state/strategies/random"


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
    const house = randomBot(state, player)
    state = play(state, player, house)
    console.log(state.getIn(["log"]).last())
  }

  return state.getIn(["log"]).toArray()
}


var logs = []


times(1000)
  .map((i) => {
    console.log(`Game ${i}`)
    logs = [...logs, ...playGame()]
  })


writeFile("data.json", JSON.stringify(logs), (err) => {
  if (err) throw err
  console.log("logs written")
})
