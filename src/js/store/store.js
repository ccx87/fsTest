import { createDevTools } from 'redux-devtools'
import LogMonitor from 'redux-devtools-log-monitor'
import DockMonitor from 'redux-devtools-dock-monitor'

import React, {Component, PropTypes} from 'react'
import {compose, createStore, combineReducers, applyMiddleware} from 'redux'
import { routerReducer, syncHistoryWithStore, routerActions, routerMiddleware } from 'react-router-redux'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import * as reducers from '../reducers'
import thunk from 'redux-thunk'
// import logger from 'redux-logger'
import { createLogger } from 'redux-logger'

//创建一个 Redux store 来以存放应用中所有的 state，应用中应有且仅有一个 store。
const logger = createLogger({
 // ...options 
});

const baseHistory = browserHistory
const routingMiddleware = routerMiddleware(baseHistory)

const reducer = combineReducers(Object.assign({}, reducers, {
    routing: routerReducer
}))

const DevTools = createDevTools(
    <DockMonitor toggleVisibilityKey="ctrl-h"
               changePositionKey="ctrl-q">
        <LogMonitor theme="tomorrow" />
    </DockMonitor>
)
//DevTools.instrument()
const enhancer = compose(
	//applyMiddleware(routingMiddleware, logger)
	applyMiddleware(thunk, logger)
)

const store = createStore(reducer, enhancer)

//var store = createStore(
//    combineReducers(reducers),
//    applyMiddleware(thunk, logger)
//);
export default store;