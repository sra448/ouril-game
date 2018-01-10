import { List, Map } from "immutable"


const initialState = Map({
  board: List([4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]),
  score: List([0, 0]),
  winner: undefined
})


export default (state = initialState, action) => {
  return state
}