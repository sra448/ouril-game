import React from "react"
import { render } from "react-dom"
import { createStore, applyMiddleware } from "redux"
import { Provider } from "react-redux"
import { createEpicMiddleware } from "redux-observable"

import reducer from "./reducer"
import epic from "./epic"
import View from "./view"


const store = createStore(reducer, applyMiddleware(createEpicMiddleware(epic)))
const app = (
  <Provider store={store}>
    <View />
  </Provider>
)


render(app, document.getElementById("container"))
