import React, {Component} from 'react'
import { connect } from 'react-redux'

import Header from '../common/header'
import Footer from '../common/footer'

import { login, getData } from '../../js/actions/index'

function select(state, ownProps) {
    //console.log("----Apps新的值来了----",state)
    const isAuthenticated = state.user.name || false
    const redirect = ownProps.location.query.redirect || '/'
    const authData = state.send.login && state.send.login.data
    return {
        state,
        authData,
        isAuthenticated,
        redirect
    }
}
class Apps extends Component {
    componentDidMount() {
        //console.log('-----Apps----componentDidMount：', this.props)
        //if( this.props.isAuthenticated ){
            
        //}
        //this.props.getData()
    }   
    componentWillReceiveProps(nextProps) {
        //console.log('-----Apps----componentWillReceiveProps：',nextProps)
        //console.log(nextProps.state)
        //console.log(nextProps.state.send)
        //console.log(nextProps.state.send.get('data'))
    }    
    render() {
    	const { params, authData, isAuthenticated } = this.props
    	//console.log("路由加载的内容：",this.props, params)
    	let param = "home-page"
    	for(let key of Object.keys(params)){ 
    		param = key + "-page" 
    	}
        return (
	        <div className="app">
            	{this.props.children}
            </div>                                       
        )
    }
}
export default connect(select, {login, getData})(Apps);