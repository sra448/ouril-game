import { List } from "immutable"


const nextHouse = (currentHouse, initHouse) => {
  const id = (currentHouse + 1) % 12
  return id == initHouse ? nextHouse(id) : id
}


const prevHouse = (house) => {
  return house - 1 >= 0 ? house - 1 : 11
}


const isOpponentHouse = (house, player) => {
  if (player === 0) {
    return house > 5
  } else {
    return house < 6
  }
}


const canCapture = (board, house, player) => {
  const stones = board.getIn([house])
  return isOpponentHouse(house, player) && stones >= 2 && stones <= 3
}


const capture = (state, house, player) => {
  const board = state.getIn(["board"])

  if (canCapture(board, house, player)) {
    const prevId = prevHouse(house)
    const newState = state
      .setIn(["board", house], 0)
      .updateIn(["score", player], x => x + board.getIn([house]))

    return capture(newState, prevId, player)
  } else {
    return state
  }
}


const play = (state, player, currentHouse, stonesLeft, initHouse) => {
  const newState = state.updateIn(["board", currentHouse], x => x + 1)

  if (stonesLeft > 1) {
    const nextId = nextHouse(currentHouse, stonesLeft < 12 ? initHouse : undefined)
    return play(newState, player, nextId, stonesLeft - 1, initHouse)

  } else if (canCapture(newState.getIn(["board"]), currentHouse, player)) {
    return capture(newState, currentHouse, player)

  } else {
    return newState
  }
}


const checkNoMoreStones = (state, player) => {
  const opponent = player === 1 ? 0 : 1
  const board = state.getIn(["board"]).toArray()
  const stones = [0, 1, 2, 3, 4, 5]
    .map(x => board[opponent * 6 + x])
    .reduce((a, b) => a + b)

  if (stones === 0) {
    const remainingStones = board.reduce((a, b) => a + b)
    return state.updateIn(["score", player], x => x + remainingStones)
  } else {
    return state
  }
}


const checkDraw = (state) => {
  if (state.getIn(["score", 0]) === 24 && state.getIn(["score", 1]) === 24) {
    return state.setIn(["isDraw"], true)
  } else {
    return state
  }
}


const checkWinner = (state) => {
  if (state.getIn(["score", 0]) > 24) {
    return state.setIn(["winner"], 0)
  } else if (state.getIn(["score", 1]) > 24) {
    return state.setIn(["winner"], 1)
  } else {
    return checkDraw(state)
  }
}


const logMove = (state, oldState, player, house) => {
  const oldBoard = oldState.getIn(["board"]).toArray()
  const scores = state.getIn(["score"]).toArray()
  const score = scores[player] - oldState.getIn(["score", player])

  return state.updateIn(["log"], ls =>
    ls.push(List([...oldBoard, ...scores, player, house, score]))
  )
}


export default (state, player, house) => {
  const board = state.getIn(["board"])
  const id = player * 6 + house
  const stonesLeft = board.getIn([id])
  const newState = play(state.setIn(["board", id], 0), player, nextHouse(id), stonesLeft, id)
  const newerState = checkWinner(checkNoMoreStones(newState, player))

  return logMove(newerState, state, player, house)
}
