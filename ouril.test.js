import { List } from 'immutable'
import play from './ouril'


const initBoard = List([4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4])


test('playing a house distributes its stones to its right neighbours one by one', () => {
  expect(play(initBoard, 0, 0).toArray())
    .toEqual([0, 5, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4])
})


test('playing a house distributes its stones even to the opponents houses', () => {
  expect(play(initBoard, 0, 5).toArray())
    .toEqual([4, 4, 4, 4, 4, 0, 5, 5, 5, 5, 4, 4])

  expect(play(initBoard, 1, 5).toArray())
    .toEqual([5, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 0])
})


test('distributing stones skips the original house the first time', () => {
  const bigStack = List([12, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4])
  const biggerStack = List([24, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4])

  expect(play(bigStack, 0, 0).toArray())
    .toEqual([0, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5])

  expect(play(biggerStack, 0, 0).toArray())
    .toEqual([1, 7, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6])
})


test('when the last stone falls in a house with 2 or fewer stones the stones are captured', () => {
  const catchMe = List([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])

  expect(play(catchMe, 0, 5).toArray())
    .toEqual([1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1])
})


test('when capturing a house, also capture its left neighbours as long as they qualify', () => {
  const catchMe = List([1, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 1])

  expect(play(catchMe, 0, 5).toArray())
    .toEqual([1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1])
})


test('only capture stones in the opponents houses', () => {
  const catchMe = List([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
  const catchMore = List([1, 1, 1, 1, 6, 1, 1, 1, 1, 1, 1, 1])

  expect(play(catchMe, 0, 0).toArray())
    .toEqual([0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])

  expect(play(catchMore, 0, 4).toArray())
    .toEqual([1, 1, 1, 1, 0, 2, 0, 0, 0, 0, 0, 1])
})
