import React from "react"
import { connect } from "react-redux"
import { chunk } from "lodash"


require("./style.scss")


// React Redux Bindings

const mapStateToProps = (state) => {
  return { state }
}


const mapDispatchToProps = () => {
  return {}
}


// Main Component


const main = ({ state }) => {
  const board = state.getIn(["board"]).toArray()
  const [player, opponent] = chunk(board, 6)

  return (
    <div>
      <h1>ouril</h1>
      <div>
        <div class="board-side">
          <div>
            { opponent.reverse().map((x, i) => (
              <div key={i}>{x}</div>
            ))}
          </div>
        </div>
        <div class="board-side">
          <div>
            { player.map((x, i) => (
              <div key={i}>{x}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


// Connected Main Component

export default connect(mapStateToProps, mapDispatchToProps)(main)
