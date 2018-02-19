import { Observable } from "rxjs"
import { times, random } from "lodash"
import { List, Map } from "immutable"
import { writeFile } from "fs"
import Minimist from "minimist"

import play from "./state/ouril"
import randomBot from "./state/strategies/random"
import randomMaxBot from "./state/strategies/random-max"
import maxBot from "./state/strategies/max"
import minMaxBot from "./state/strategies/min-max"


const bots = {
  "random": randomBot,
  "max": maxBot,
  "randomMax": randomMaxBot,
  "minMax": minMaxBot
}


const argv = Minimist(process.argv.slice(2))
const gamesCount = +argv["t"] || 10000
const bot1 = argv["b1"] ? bots[argv["b1"]] : minMaxBot
const bot2 = argv["b2"] ? bots[argv["b2"]] : randomBot


console.log("-----------")
console.log(`Games: ${gamesCount}`)
console.log(`Bot 1: ${argv["b1"] || "minMax"}`)
console.log(`Bot 2: ${argv["b2"] || "random"}`)
console.log("-----------")


const nextPlayer = player => player === 0 && 1 || 0


const initGameState = Map({
  board: List([4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]),
  score: List([0, 0]),
  winner: undefined,
  isDraw: false,
  log: List([])
})


const playGame = (state = initGameState, prevPlayer = 1) => {
  if (state.getIn(["winner"]) === undefined
      && state.getIn(["isDraw"]) === false) {

    const player = nextPlayer(prevPlayer)
    const bot = player == 0 ? bot1 : bot2

    return bot(state, player)
      .switchMap((house) => {
        return playGame(play(state, player, house), player)
      })
  } else {
    return new Observable((observer) => {
      observer.next(state)
      observer.complete()
    })
  }
}


Observable
  .range(1, gamesCount)
  .switchMap(() => playGame())
  .bufferCount(2000)
  .scan((wins, games, i) => {
    const logs = games.reduce((acc, game) => {
      return [...acc, ...game.getIn(["log"]).toArray()]
    }, [])

    const newWins = games.reduce(([a, b], game) => {
      const winner = game.getIn(["winner"])
      return [winner === 0 ? a + 1 : a, winner === 1 ? b + 1 : b]
    }, wins)

    console.log(`${i + 1} -> ${newWins} -> avg length: ${(logs.length + 1) / (games.length + 1)}`)

    writeFile(`../learning/data/data-${Date.now()}.json`, JSON.stringify(logs), (err) => {
      if (err) throw err
    })

    return newWins
  }, [0, 0])
  .subscribe()
