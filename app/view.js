import React from "react"
import { connect } from "react-redux"
import { chunk } from "lodash"


require("./style.scss")


// React Redux Bindings

const mapStateToProps = (state) => {
  return { state }
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


const BoardSide = ({ houses, player, reversed, onPlay }) => {
  const className = reversed ? "board-side reversed" : "board-side"

  return (
    <div className={className}>
      <div>
        { houses.map((x, i) => (
          <div key={i} onClick={onPlay(player, i)}>{x}</div>
        ))}
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
        <BoardSide houses={opponent} player={1} onPlay={onPlay} reversed={true} />
        <BoardSide houses={player} player={0} onPlay={onPlay} />
      </div>
    </div>
  )
}


// Connected Main Component

export default connect(mapStateToProps, mapDispatchToProps)(main)
