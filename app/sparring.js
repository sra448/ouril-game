import { times, random } from "lodash"
import { List, Map } from "immutable"
import play from "./state/ouril"


const nextPlayer = player => player === 0 && 1 || 0


const playGame = () => {
  var player = 1
  var state = Map({
    board: List([4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]),
    score: List([0, 0]),
    winner: undefined,
    log: List([])
  })

  while (state.getIn(["winner"]) === undefined) {
    player = nextPlayer(player)

    const houses = state.getIn(["board"]).toArray()
    const possibleHouses = [0, 1, 2, 3, 4, 5].reduce((acc, x, i) => {
      if (houses[player * 6 + i] !== 0) {
        return [...acc, i]
      } else {
        return acc
      }
    }, [])

    state = play(state, player, possibleHouses[random(possibleHouses)])
    console.log(state.getIn(["log"]).last())
  }
}


times(100)
  .map((i) => {
    console.log(`Game ${i}`)
    playGame()
  })
