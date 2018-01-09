import { List } from 'immutable'
import play from './ouril'


const initBoard = List([4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4])


test('playing a house distributes its stones to its right neighbours one by one', () => {
  expect(play(initBoard, 0, 0).toArray())
    .toEqual([0, 5, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4])
});


test('playing a house distributes its stones even to the opponents houses', () => {
  expect(play(initBoard, 0, 5).toArray())
    .toEqual([4, 4, 4, 4, 4, 0, 5, 5, 5, 5, 4, 4])

  expect(play(initBoard, 1, 5).toArray())
    .toEqual([5, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 0])
});


test('distributing stones skips the original house the first time', () => {
  const bigStack = List([12, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4])
  const biggerStack = List([24, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4])

  expect(play(bigStack, 0, 0).toArray())
    .toEqual([0, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5])

  expect(play(biggerStack, 0, 0).toArray())
    .toEqual([1, 7, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6])
});

