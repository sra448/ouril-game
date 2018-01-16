import { fromPromise } from "rxjs"
import { random } from "lodash"
import Keras from "keras-js"


const model = new KerasJS.Model({
  filepath: "./ouril.bin"
})


export default (state, player) => {
  const houses = state.getIn(["board"]).toArray()
  const score = state.getIn(["score"]).toArray()

  const possibleHouses = [0, 1, 2, 3, 4, 5].reduce((acc, x, i) => {
    if (houses[player * 6 + i] !== 0) {
      return [...acc, i]
    } else {
      return acc
    }
  }, [])

  return fromPromise(model
    .ready()
    .then(() => {
      return Promise.all(possibleHouses
        .map((house) => {
          const input = {
            input_1: new Float32Array(...[...houses, ...score, player, house])
          }
          return model.predict(input)
        }))
        .then((results) => {
          results.reduce(([id, highScore], score, i) => {
            return score >= highScore ? [possibleHouses[i], score] : [id, highScore]
          }, [undefined, -99])[0]
        })
    }))
}