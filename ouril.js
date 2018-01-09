const nextHouse = (currentHouse, initHouse) => {
  const id = (currentHouse + 1) % 12
  return id == initHouse ? nextHouse(id) : id
}


const play = (board, currentHouse, stonesLeft, initHouse) => {
  if (stonesLeft > 1) {
    const boardLeft = board.updateIn([currentHouse], x => x + 1)
    const nextId = nextHouse(currentHouse, stonesLeft < 12 ? initHouse : undefined)

    return play(boardLeft, nextId, stonesLeft - 1, initHouse)

  } else {
    return board.updateIn([currentHouse], x => x + 1)
  }
}


module.exports = (board, player, house) => {
  const id = player * 6 + house
  const stonesLeft = board.getIn([id])
  const boardLeft = board.setIn([id], 0)

  return play(boardLeft, nextHouse(id), stonesLeft, house)
}
