// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { rootSaga } from './sagas';

import App from './App';
import appState from './reducers';
import { isLoggedIn } from './auth';

import 'bulma/css/bulma.css'
import './index.css';


const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  appState,
  { user: { isLoggedIn: isLoggedIn() } },
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
