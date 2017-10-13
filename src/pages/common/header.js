import React, { Component } from 'react';
import { Link } from 'react-router';

import SearchBar from './searchBar';
import BaseLogo from './baseLogo';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }    	
    render() {
        //isAuthenticated = 用户ID
	    return (
	        <div className="header flex flex-a-c">
                <BaseLogo/>
                <SearchBar isAuthenticated={654} noJump={true}/>
	        </div>
	    )
    }
}
export default Header