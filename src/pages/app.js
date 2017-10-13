 import React, { Component } from 'react'
 import { render } from 'react-dom'
 import { Provider } from 'react-redux'
 import 'babel-polyfill'
 
 import store from '../js/store/store'
 import route from '../js/router/route'
 
 import '../css/all.scss'

 render(
    <Provider store={store}>
        {route}
    </Provider>,
    document.getElementById('FOSHAN_SEARCH_PC')
 ); 