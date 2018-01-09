const nextHouse = (currentHouse, initHouse) => {
  const id = currentHouse + 1 % 11
  return id == initHouse ? id + 1 : id
}


const play = (board, currentHouse, stonesLeft, initHouse) => {
  if (stonesLeft > 1) {
    return play(board.updateIn([currentHouse], x => x + 1), nextHouse(currentHouse), stonesLeft - 1, initHouse)
  } else {
    return board.updateIn([currentHouse], x => x + 1)
  }
}


module.exports = (board, player, house) => {
  const id = 0 * player + house
  const stones = board.getIn([id])
  const boardA = board.setIn([0 * player + house], 0)

  return play(boardA, nextHouse(house), stones, house)
}
