import { List, Map } from 'immutable'
import play from '../state/ouril'


const state = Map({
  board: List([4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]),
  score: List([0, 0]),
  winner: undefined,
  log: List([])
})


test('playing a house distributes its stones to its right neighbours one by one', () => {
  expect(play(state, 0, 0).getIn(["board"]).toArray())
    .toEqual([0, 5, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4])
})


test('playing a house distributes its stones even to the opponents houses', () => {
  expect(play(state, 0, 5).getIn(["board"]).toArray())
    .toEqual([4, 4, 4, 4, 4, 0, 5, 5, 5, 5, 4, 4])

  expect(play(state, 1, 5).getIn(["board"]).toArray())
    .toEqual([5, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 0])
})


test('distributing stones skips the original house the first time', () => {
  const bigStack = List([12, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4])
  const biggerStack = List([24, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4])

  expect(play(state.setIn(["board"], bigStack), 0, 0).getIn(["board"]).toArray())
    .toEqual([0, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5])

  expect(play(state.setIn(["board"], biggerStack), 0, 0).getIn(["board"]).toArray())
    .toEqual([1, 7, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6])
})


test('when the last stone falls in a house with 2 or fewer stones the stones are captured', () => {
  const catchMe = List([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])

  expect(play(state.setIn(["board"], catchMe), 0, 5).getIn(["board"]).toArray())
    .toEqual([1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1])
})


test('when capturing a house, also capture its left neighbours as long as they qualify', () => {
  const catchMe = List([1, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 1])

  expect(play(state.setIn(["board"], catchMe), 0, 5).getIn(["board"]).toArray())
    .toEqual([1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1])
})


test('only capture stones in the opponents houses', () => {
  const catchMe = List([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
  const catchMore = List([1, 1, 1, 1, 6, 1, 1, 1, 1, 1, 1, 1])
  const catchMore2 = List([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 1])

  expect(play(state.setIn(["board"], catchMe), 0, 0).getIn(["board"]).toArray())
    .toEqual([0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])

  expect(play(state.setIn(["board"], catchMe), 1, 0).getIn(["board"]).toArray())
    .toEqual([1, 1, 1, 1, 1, 1, 0, 2, 1, 1, 1, 1])

  expect(play(state.setIn(["board"], catchMore), 0, 4).getIn(["board"]).toArray())
    .toEqual([1, 1, 1, 1, 0, 2, 0, 0, 0, 0, 0, 1])

  expect(play(state.setIn(["board"], catchMore2), 1, 4).getIn(["board"]).toArray())
    .toEqual([0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 2])
})


test('capturing stones grants points', () => {
  const catchMe = List([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
  const catchMore = List([1, 1, 1, 1, 1, 6, 1, 1, 1, 1, 1, 1])
  const catchMore2 = List([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6])

  expect(play(state.setIn(["board"], catchMe), 0, 5).getIn(["score", 0]))
    .toBe(2)

  expect(play(state.setIn(["board"], catchMe), 1, 5).getIn(["score", 1]))
    .toBe(2)
})


test('when the player has no more stone to play, the remaining stones belong to the opponent', () => {
  const noMoves = List([1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0])
  const noMoves2 = List([0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1])

  expect(play(state.setIn(["board"], noMoves), 0, 0).getIn(["score", 0]))
    .toBe(6)

  expect(play(state.setIn(["board"], noMoves2), 1, 0).getIn(["score", 1]))
    .toBe(6)
})


test('the first player to reach 25 stones wins', () => {
  const catchMe = List([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
  const almostWon = state.setIn(["score", 0], 23)
  const almostWon2 = state.setIn(["score", 1], 23)

  expect(play(state.setIn(["board"], catchMe), 0, 5).getIn(["winner"]))
    .toBe(undefined)

  expect(play(almostWon.setIn(["board"], catchMe), 0, 5).getIn(["winner"]))
    .toBe(0)

  expect(play(state.setIn(["board"], catchMe), 1, 5).getIn(["winner"]))
   .toBe(undefined)

  expect(play(almostWon2.setIn(["board"], catchMe), 1, 5).getIn(["winner"]))
    .toBe(1)
})


test('if both players hav 24 stones, its a draw', () => {
  const catchMe = List([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
  const almostWon = state.setIn(["score", 0], 22).setIn(["score", 1], 24)

  expect(play(almostWon.setIn(["board"], catchMe), 0, 5).getIn(["isDraw"]))
    .toBe(true)
})


test('moves are logged', () => {
  expect(play(state, 0, 5).getIn(["log", 0]).toArray())
    .toEqual([4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 5, 0])
})


// plays a house that is empty
// [ 15, 12, 1, 0, 1, 2, 0, 0, 1, 0, 3, 1, 13, 0, 1, 0, 0 ]
// [ 15, 12, 1, 0, 1, 2, 0, 1, 1, 0, 3, 1, 13, 0, 0, 2, 0 ]


// captures houses at 1 and 2 stones (not the first one)
// List [ 12, 2, 2, 1, 1, 0, 1, 4, 3, 0, 0, 0, 11, 12, 1, 0, 0 ]
// List [ 12, 2, 2, 1, 1, 6, 0, 3, 2, 1, 1, 2, 11, 12, 0, 5, 7 ]