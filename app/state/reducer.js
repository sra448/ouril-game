import { List, Map } from "immutable"
import play from "./ouril"


const initialState = Map({
  board: List([4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]),
  score: List([0, 0]),
  winner: undefined,
  log: List([]),
  currentPlayer: 0
})


const nextPlayer = player => player === 0 && 1 || 0


const playHouse = (state, player, house) => {
  if (player === state.getIn(["currentPlayer"])) {
    return play(state, player, house)
      .setIn(["currentPlayer"], nextPlayer(player))
  } else {
    return state
  }
}


export default (state = initialState, action) => {
  console.log(action)

  switch (action.type) {

    case "RENDER":
      return action.state

    default:
      return state
  }
}