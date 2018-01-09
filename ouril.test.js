import { List } from 'immutable'

const play = require('./ouril')

test('playing a house makes it empty', () => {
  const gameState = List([4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4])
  expect(play(gameState, 0, 0).get(0)).toBe(0)
  expect(play(gameState, 0, 1).get(1)).toBe(0)
});

test('playing a house distributes its stones to the next houses, one by one', () => {
  const gameState = List([4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  expect(play(gameState, 0, 0).toArray()).toEqual([0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0])
});
