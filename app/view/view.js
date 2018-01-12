import React from "react"
import { connect } from "react-redux"
import { chunk, times } from "lodash"


require("./style.scss")
require("./stone-positions.scss")


// React Redux Bindings

const mapStateToProps = (state) => {
  return { state: state.getIn(["gameState"]) }
}


const mapDispatchToProps = (dispatch) => {
  return {
    onPlay: (player, house) => () => {
      dispatch({
        type: "PLAY_HOUSE",
        player,
        house
      })
    }
  }
}


// Components


const Stones = ({ count }) => (
  times(count).map((_, i) => (
    <div className={`stone stone-${count}-${i}`} key={i} />
  ))
)


const BoardSide = ({ houses, player, reversed, onPlay }) => {
  const boardClass = reversed ? "board-side reversed" : "board-side"
  const stoneCountClass = reversed ? "stone-count reversed" : "stone-count"

  return (
    <div className={boardClass}>
      <div>
        { houses.map((x, i) => (
          <div key={i} onClick={onPlay(player, i)}>
            <div className={stoneCountClass}>{x}</div>
            <Stones count={x} />
          </div>
        )) }
      </div>
    </div>
  )
}


// Main Component


const main = ({ state, onPlay }) => {
  const board = state.getIn(["board"]).toArray()
  const [player, opponent] = chunk(board, 6)

  return (
    <div>
      <h1>ouril</h1>
      <div>
        <div>{state.getIn(["score", 1])}</div>
        <div className="board">
          <BoardSide houses={opponent} player={1} onPlay={onPlay} reversed={true} />
          <BoardSide houses={player} player={0} onPlay={onPlay} />
        </div>
        <div>{state.getIn(["score", 0])}</div>
        <div>
          { state.getIn(["log"]).toArray().reverse().map((l, i) =>
            <div key={i}>{l.toString()}</div>
          ) }
        </div>
      </div>
    </div>
  )
}


// Connected Main Component

export default connect(mapStateToProps, mapDispatchToProps)(main)
