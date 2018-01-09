const nextHouse = (currentHouse, initHouse) => {
  const id = (currentHouse + 1) % 12
  return id == initHouse ? nextHouse(id) : id
}


const prevHouse = (house) => {
  return house - 1 > 0 ? house - 1 : 11
}


const isOpponentHouse = (house, player) => {
  return !(house < player * 6 + 6)
}


const canCapture = (board, house, player) => {
  const stones = board.getIn([house])
  return isOpponentHouse(house, player) && stones > 0 && stones <= 2
}


const capture = (board, house, player) => {
  const prevId = prevHouse(house)

  if (canCapture(board, house, player)) {
    return capture(board.setIn([house], 0), prevId, player)
  } else {
    return board
  }
}


const play = (board, player, currentHouse, stonesLeft, initHouse) => {
  if (stonesLeft > 1) {
    const boardLeft = board.updateIn([currentHouse], x => x + 1)
    const nextId = nextHouse(currentHouse, stonesLeft < 12 ? initHouse : undefined)

    return play(boardLeft, player, nextId, stonesLeft - 1, initHouse)

  } else {
    if (canCapture(board, currentHouse, player)) {
      return capture(board, currentHouse, player)
    } else {
      return board.updateIn([currentHouse], x => x + 1)
    }
  }
}


module.exports = (state, player, house) => {
  const board = state.getIn(["board"])
  const id = player * 6 + house
  const stonesLeft = board.getIn([id])
  const boardLeft = board.setIn([id], 0)
  const newBoard = play(boardLeft, player, nextHouse(id), stonesLeft, house)

  return state.setIn(["board"], newBoard)
}
