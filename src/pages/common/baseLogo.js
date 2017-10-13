import React, { Component } from 'react';
import { Link } from 'react-router';

class BaseLogo extends Component {
    constructor(props) {
        super(props);
        this.state = {};	
    }           	
    render() {
	    return (
	      <div className="base-logo">
              <img className="logo" src="src/img/logo.png" />
	      </div>
	    )
    }
}
export default BaseLogo