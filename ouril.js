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
  return isOpponentHouse(house, player) && stones > 0 && stones <= 2
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
  if (stonesLeft > 1) {
    const newState = state.updateIn(["board", currentHouse], x => x + 1)
    const nextId = nextHouse(currentHouse, stonesLeft < 12 ? initHouse : undefined)

    return play(newState, player, nextId, stonesLeft - 1, initHouse)

  } else {
    const board = state.getIn(["board"])

    if (canCapture(board, currentHouse, player)) {
      return capture(state, currentHouse, player)
        .updateIn(["score", player], x => x + 1)
    } else {
      return state.updateIn(["board", currentHouse], x => x + 1)
    }
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


const checkWinner = (state) => {
  if (state.getIn(["score", 0]) > 24) {
    return state.setIn(["winner"], 0)
  } else if (state.getIn(["score", 1]) > 24) {
    return state.setIn(["winner"], 1)
  } else {
    return state
  }
}


module.exports = (state, player, house) => {
  const board = state.getIn(["board"])
  const id = player * 6 + house
  const stonesLeft = board.getIn([id])
  const newState = play(state.setIn(["board", id], 0), player, nextHouse(id), stonesLeft, id)

  return checkWinner(checkNoMoreStones(newState, player))
}
