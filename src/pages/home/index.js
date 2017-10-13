import React, { Component } from 'react';

import BaseLogo from '../common/baseLogo'
import Footer from '../common/footer'
import SearchBar from '../common/searchBar'
import { Tool } from '../../js/config/tool'

export default class Index extends Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        console.log('----Home----componentDidMount：',this.props)
    }        
    render() {
        //isAuthenticated = 用户ID
        return (
            <div className="home"> 
                <div className="home-main container flex flex-a-c flex-j-c flex-d-c">
                    <BaseLogo />
                    <SearchBar isAuthenticated={654}/>
                    <Footer />
                </div>
            </div>
        );
    }
}