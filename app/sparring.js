import { times, random } from "lodash"
import { List, Map } from "immutable"
import play from "./state/ouril"
import { writeFile } from "fs"


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

    const houses = state.getIn(["board"]).toArray()
    const possibleHouses = [0, 1, 2, 3, 4, 5].reduce((acc, x, i) => {
      if (houses[player * 6 + i] !== 0) {
        return [...acc, i]
      } else {
        return acc
      }
    }, [])

    const house = possibleHouses[random(possibleHouses.length - 1)]

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


writeFile("logs.json", JSON.stringify({ logs }), (err) => {
  if (err) throw err
  console.log("logs written")
})
