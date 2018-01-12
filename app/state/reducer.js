import { List, Map } from "immutable"


const initialState = Map({
  gameState: Map({
    board: List([4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]),
    score: List([0, 0]),
    winner: undefined,
    log: List([])
  }),
  currentPlayer: 0
})


const updateGameState = (state, gameState) => {
  return state.setIn(["gameState"], gameState)
}


const switchPlayer = (state, nextPlayer) => {
  return state.setIn(["currentPlayer"], nextPlayer)
}


export default (state = initialState, action) => {
  console.log(action)

  switch (action.type) {

    case "GAME_STATE_CHANGE":
      return updateGameState(state, action.state)

    case "SWITCH_PLAYER":
      return switchPlayer(state, action.nextPlayer)

    default:
      return state
  }
}