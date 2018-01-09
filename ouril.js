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


module.exports = (state, player, house) => {
  const board = state.getIn(["board"])
  const id = player * 6 + house
  const stonesLeft = board.getIn([id])

  return play(state.setIn(["board", id], 0), player, nextHouse(id), stonesLeft, id)
}
