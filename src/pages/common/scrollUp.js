import React, { Component } from 'react';
import { Link } from 'react-router';
// import './common.scss';

class ScrollUp extends Component {
    constructor(props) {
        super(props);
        this.state = {};	
    }    	
    render() {
	    return (
            <div id="scrollUp">
    	        <div className="scroll-up">
                    <a className="plans plans-align-center plans-justify-center" href="#top">下载</a>
                    <a className="plans plans-align-center plans-justify-center" href="#top">QQ群</a>
                    <a className="plans plans-align-center plans-justify-center" href="#top">意见反馈</a>
                    <a className="plans plans-align-center plans-justify-center" href="#top">客服</a>
                    <a className="plans plans-align-center plans-justify-center" href="#top">回到顶部</a>    
    	        </div>
            </div>
	    );
    }
}
export default ScrollUp