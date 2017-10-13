import React, { Component } from 'react';
import { Link } from 'react-router';
// import './common.scss';

class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {};	
    }           	
    render() {
	    return (
	      <div className="footer">
             <p>
                 Copyright©2016-2017<a style={{"marginLeft":"5px","marginRight":"5px"}} href="http://www.lianty.com/" >链图云</a>All rights reserved. 闽ICP备11025350号-2 
             </p>
	      </div>
	    );
    }
}
export default Footer