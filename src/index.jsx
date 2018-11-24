import React from "react";
import ReactDOM from "react-dom";
import { createStore, compose, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxThunk from "redux-thunk";
import { BrowserRouter } from "react-router-dom";
import * as serviceWorker from "./serviceWorker";

import "./index.css";
import App from "./App";
import rootReducer from "./store/reducers/rootReducer";

// Redux dev tools
const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(reduxThunk))
);

const app = (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(app, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
