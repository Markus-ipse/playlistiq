import 'core-js/es6/array';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';

import 'bulma/css/bulma.css';
import './index.css';

import App from './App';
import { AppState, appStateReducers } from './reducers/index';
import { rootSaga } from './sagas/index';

const rootReducer = combineReducers<AppState>(appStateReducers);

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(sagaMiddleware) as Function), // tslint:disable-line:ban-types
);

sagaMiddleware.run(rootSaga);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root') as HTMLElement,
);
