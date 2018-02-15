import { List } from "immutable"
import { Observable } from "rxjs"


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


const capture = (state, house, player, observer) => {
  const board = state.getIn(["board"])

  if (canCapture(board, house, player)) {
    const prevId = prevHouse(house)
    const newState = state
      .setIn(["board", house], 0)
      .updateIn(["score", player], x => x + board.getIn([house]))

    if (observer) {
      observer.next([newState, house, "capture"])
    }

    return capture(newState, prevId, player, observer)
  } else {
    return state
  }
}


const play = (state, player, currentHouse, stonesLeft, initHouse, observer) => {
  const newState = state.updateIn(["board", currentHouse], x => x + 1)
  if (observer) {
    observer.next([newState, currentHouse, "seed"])
  }

  if (stonesLeft > 1) {
    const nextId = nextHouse(currentHouse, stonesLeft < 12 ? initHouse : undefined)
    return play(newState, player, nextId, stonesLeft - 1, initHouse, observer)

  } else if (canCapture(newState.getIn(["board"]), currentHouse, player)) {
    return capture(newState, currentHouse, player, observer)

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
  const oldScore = oldState.getIn(["score"]).toArray()
  const score = scores[player] - oldState.getIn(["score", player])
  const logScore = player == 0 ? oldScore : oldScore.reverse()
  const logHouse = player * 6 + house

  return state.updateIn(["log"], ls =>
    ls.push(List([...oldBoard, logHouse, ...logScore, score]))
  )
}


const move = (state, player, house, observer) => {
  const board = state.getIn(["board"])
  const id = player * 6 + house
  const stonesLeft = board.getIn([id])

  const clearedHouse = state.setIn(["board", id], 0)
  if (observer) observer.next([clearedHouse, id, "init"])

  const newState = play(clearedHouse, player, nextHouse(id), stonesLeft, id, observer)

  const newerState = checkWinner(checkNoMoreStones(newState, player))
  const finalState = logMove(newerState, state, player, house)
  if (observer) {
    observer.next([finalState])
    observer.complete()
  }

  return finalState
}


export const playObserve = (state, player, house) => {
  return new Observable((observer) => {
    move(state, player, house, observer)
    return () => {}
  })
}



export default (state, player, house) => {
  return move(state, player, house)
}
