import React, {Component, PropTypes} from 'react';
import pureRender from 'pure-render-decorator';
import { connect } from 'react-redux';
import { is, fromJS } from 'immutable';
import * as actions from '../actions';


const Template = mySeting => {
    let seting = {
        id: '', //应用唯一id表示
        url: '', //请求地址
        data: {}, //发送给服务器的数据
        method: '', //请求方式GET,POST,PUT等
        component: <div></div>, //数据回调给的组件
    };

    for (let key in mySeting) {
        seting[key] = mySeting[key];
    }
    //static defaultProps = { seting }
    class Reduxs extends Component {
        constructor(props,context) {
            super(props,context);
        }

        render() {
            console.log('--------Template------render：', this.props, this.state)
            return <this.props.seting.component {...this.props} state={this.props.state && this.props.state.toJS()}/>;
        }

        componentDidMount() {//获取数据
            if ( this.props.seting.url ) {
                console.log('--------Template------componentDidMount：发起请求：', this.props.seting)
                this.props.fetchPosts(this.props.seting.url, this.props.seting.data, this.props.seting.method);
            }
        }

        componentWillReceiveProps(nextProps) {
            
        }

        shouldComponentUpdate(nextProps, nextState) {
            if (nextProps.state.get('isFetching')) {
                return false
            }
            return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
        }
    }
    Reduxs.defaultProps = {
        seting
    };

    //mapStateToProps and mapDispatchToProps
    return connect(state => { //将顶层组件与模版绑定后return回去，配置路由的时候用的就是和redux绑定的组件，所以其实每个路由匹配的都是同一个组件，只不过这个组件的内容不同
        let { usre } = state;
        return { 
            state: state['fetchData'],
            usre
        } 
    }, actions)(Reduxs); //连接redux
}
export default Template;