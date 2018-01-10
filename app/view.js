import React from "react"
import { connect } from "react-redux"


// React Redux Bindings

const mapStateToProps = (state) => {
  return state
}


const mapDispatchToProps = () => {
  return {}
}


// Main Component


const main = (state) => {
  return (
    <h1>ouril</h1>
  )
}


// Connected Main Component

export default connect(mapStateToProps, mapDispatchToProps)(main)
