import React, { Component } from 'react';
import { SHITU_MODE, WEB_LIST } from '../../js/config/locaData'
import { NT_TEXT } from '../../js/config/api'

export default class ShituList extends Component {
  render() {
    const { filterArray, onNavFilter, switchFilter, onNavSwitchFilter, mode, keyWord } = this.props
    let jumpUrl;
    if( mode === SHITU_MODE.text && switchFilter ){
        switch(switchFilter.value){
            case WEB_LIST.nitu.value:
                jumpUrl = NT_TEXT +'?q='+ keyWord 
            break;
        }
    }
    return (
        <div className="sm-filter">
            {
                switchFilter ?
                    <div className="container full-w-h rel">
                        <ul className="filter-ul full-w flex flex-a-c flex-w">
                            <li style={{"color": "#666"}}>其它搜索引擎：</li>
                            <li className="filter-item">
                                <span className="text source">{switchFilter.text}</span>
                                {
                                    mode === SHITU_MODE.image ? 
                                        <i className="i-btn icon-20 icons" onClick={() => onNavSwitchFilter(null)}></i>
                                    :
                                        jumpUrl ?
                                            <span style={{"marginLeft":"10px"}} className="pic-msg"><a className="col-lan" href={jumpUrl} target="_blank">点击此处</a><span className="col-hui">查看更多{switchFilter.text}搜索结果</span></span>    
                                        :
                                           null
                                }
                            </li>                                                      
                        </ul>
                    </div>                     
                :
                    filterArray && filterArray.length > 0 ? 
                        <div className="container full-w-h rel">
                            <ul className="filter-ul full-w flex flex-a-c flex-w">
                                <li className="first f-btn" onClick={() => onNavFilter('INIT')}>清除筛选</li>
                                {
                                    filterArray.map((item, index) =>
                                        <li key={index} className="filter-item">
                                            <span className="text source">{item.text}</span>
                                            <i className="i-btn icon-20 icons" onClick={() => onNavFilter('DEL', item)}></i>
                                        </li>
                                    )
                                }                                                      
                            </ul>
                            <div className="abs unfold" style={{"display":"none"}}><i className="icon-20 icons"></i>更多</div> 
                        </div> 
                    :
                        null                   
            }
        </div>
    );
  }
}