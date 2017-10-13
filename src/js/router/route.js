import React, { Component } from 'react'
import { Router, Route, IndexRoute, Redirect, browserHistory, hashHistory } from 'react-router'
import { routerActions, syncHistoryWithStore } from 'react-router-redux'
import { UserAuthWrapper } from 'redux-auth-wrapper'

import store from '../store/store';

import Apps from '../../pages/app/app'
import Trademark from '../../pages/home/index' //商标首页
import WisdomImage from '../../pages/home/index2' //智慧检索首页
import Search from '../../pages/search/index' //商标检索
import Search2 from '../../pages/search/index2' //智慧应用商店--图像检索系统

//17线上用hashHistory
//本地用browserHistory或hashHistory
const history = syncHistoryWithStore(browserHistory, store)

const UserIsAuthenticated = UserAuthWrapper({
    authSelector: state => state.user,
    redirectAction: routerActions.replace,
    wrapperDisplayName: 'UserIsAuthenticated'
})
export const RouteConfig = (
    <Router history={history}>
        <Route path="/" component={Apps}>
            <IndexRoute component={WisdomImage} />
            <Route path="trademark(/:trademark)" component={Trademark} />
            <Route path="search(/:search)" component={Search} />
            <Route path="image(/:image)" component={WisdomImage} />
            <Route path="search2(/:search)" component={Search2} />
            <Redirect from='*' to='/' />          
        </Route>       
    </Router>
);
export default RouteConfig;