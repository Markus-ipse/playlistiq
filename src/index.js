// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';

import 'bulma/css/bulma.css';
import './index.css';

import App from './App';
import appStateReducer from './reducers';
import { rootSaga } from './sagas';
import { isLoggedIn } from './auth';

import type { Store } from './types/index';

const sagaMiddleware = createSagaMiddleware();

const preloadedState = { user: { isLoggedIn: isLoggedIn() } };

const store: Store = createStore(
  appStateReducer,
  preloadedState,
  composeWithDevTools(applyMiddleware(sagaMiddleware)),
);

sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
