import { List } from "immutable"
import { Observable } from "rxjs"
import { range } from "lodash"


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


const getDestinations = (house, stones) => {
  return range(stones < 12 ? stones : stones + 1)
    .reduce((acc, x, i) => {
      if (i != 11) acc[(house + i + 1) % 12] += 1
      return acc
    }, range(12).map(x => 0))
}


const logMove = (state, oldState, player, house) => {
  const houseId = player * 6 + house
  const board = oldState.getIn(["board"]).toArray()
  const move = range(12).map((x, i) => i == houseId ? 1 : 0)
  const destinations = getDestinations(houseId, oldState.getIn(["board", houseId]))
  const captures = range(12).map((x, i) => {
    return i != houseId && state.getIn(["board", i]) === 0 ? board[i] + destinations[i] : 0
  })
  const score = oldState.getIn(["score"]).toArray()
  const logScore = player == 0 ? score : score.reverse()

  const newMove = List([...board, ...move, ...destinations, ...captures, ...logScore, 0])
  const newState = state.updateIn(["log"], ls => ls.push(newMove))

  const winner = state.getIn(["winner"])

  if (winner !== undefined) {
    return newState
      .updateIn(["log"], ls => {
        return ls.map((x, i) => {
          return winner == 0 && i % 2 == 0 ||
            winner == 1 && i % 2 == 1
              ? x.setIn([x.size - 1], 1)
              : x.setIn([x.size - 1], -1)
            })
      })
  } else {
    return newState
  }
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
