import React, { Component } from 'react'
import { connect } from 'react-redux'
import isEmpty from 'lodash.isempty'

import { Tool } from '../../js/config/tool'
import { STID } from '../../js/config/api'
import { getData } from '../../js/actions/common'
import { SHITU_MODE } from '../../js/config/locaData'
import Header from '../common/header'

class Search extends Component {
    constructor() {
        super();
        this.state = {
            shituMode: SHITU_MODE.image,
            uploadData: null,  
            searchArray: null,
            searchData: null        
        };
        this.getSearchData = res => {
            if( res.errorCode == 0 ){
                if( res.mode === SHITU_MODE.image ){
                    //图片搜索
                    if( res.data ){
                        const stIds = res.data.map(item => item.stId)
                        this.props.getData(STID, 'get', {stIds: stIds.join(',')}, 'searchData')
                    }
                    this.setState({
                        uploadData: res,
                        searchData: null, //初始化
                        shituMode: SHITU_MODE.image
                    })                
                }else{
                    //文字搜索
                    Tool.alert('文字搜索正在开发中')
                }
            }else{
                Tool.alert( res.error || '识图失败' )
            }
        }
    }  
    componentDidMount() {
        console.log('----SearchIndex----componentDidMount：',this.props) 
        console.log("=====商标搜索缓存数据====", Tool.getLocal('trademackData'))
        //读取缓存数据
        const inItLocal = Tool.getLocal('trademackData')
        if( inItLocal ){
            this.getSearchData(inItLocal)
        }
        if( _hmt ){
            //百度统计
            console.log('百度统计')
            _hmt.push(['_trackEvent', '商标搜索', '图片搜索', '搜全部']); 
        }             
    }  
    componentWillReceiveProps(nextProps) {
        console.log('-----SearchIndex----componentWillReceiveProps：',nextProps)
        let stateObj;
        if( nextProps.state && nextProps.state.send && nextProps.state.send.get ){
            stateObj = nextProps.state.send.get('data')
        }
        console.log("=====商标搜索新数据====", stateObj)
        if( stateObj ){
            if( stateObj.trademackData && stateObj.trademackData.json ){
                this.getSearchData(stateObj.trademackData.json)
                return
            }  
            if( stateObj.searchData ){
                const res = stateObj.searchData.json
                if( res.errorCode == 0 ){
                    // //格式重组
                    // this.reformattingType(res.data)
                    // //使用权重组
                    // this.refilesUse(res.data)
                    // //来自某站重组
                    // this.refilesFrom(res.data)
                    this.setState({
                        searchArray: res.data,
                        searchData: res.data
                    })
                }
            }
        }  
    }    
    render() {
        const { searchData, uploadData } = this.state   
        return (
            <div className="trademack-main"> 
                <Header noJump={true}/>
                <div className="trademack-content flex">
                    <div className="tc-filter flex-0">
                        <div className="title">分类过滤</div>
                    </div>
                    <div className="tc-panel flex-1">
                        <div className="list flex flex-w">
                            {
                                uploadData ?
                                    searchData ?
                                        searchData.length > 0 ?
                                            searchData.map((item, index) => {
                                                return <div className="item" key={index}>
                                                            <div className="top">
                                                                <img src={item.img} alt="商标"/>
                                                            </div>
                                                            <div className="bottom flex flex-a-c flex-j-c">{item.brandName || '--'}</div> 
                                                       </div>
                                            })
                                        :
                                            <div className="no-data">没有搜索到相关商标素材</div>
                                    :
                                        <div className="loading">
                                            <img src="src/img/loading.gif"/>正在加载中...
                                        </div>                                         
                                :
                                    <div className="no-data">没有搜索到相关商标素材</div>      
                            }                                                                                    
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
function select(state, ownProps) {
    return {
        state
    }
}
export default connect(select, {getData})(Search)