import React, { Component } from 'react'
import isEmpty from 'lodash.isempty'
import { Tool } from '../../js/config/tool'

export default class ShituList extends Component {
  render() {
    const { searchData, onShowPreview, imgUseArray } = this.props
    return (
        <div className="sm-list" style={{"minHeight": "500px"}}>
            <div className="container full-w-h">
                <ul className="list-ul">
                    {
                        searchData ?
                            searchData.length > 0 ?
                                searchData.map((item, index) => {
                                    const imgSrc = item.img,
                                          fileType = item.fileType && item.fileType.toUpperCase(),
                                          typeClass = "item-type "+Tool.trim(fileType)+"-type-bg",
                                          useData = imgUseArray.find( use => item.free === use.value ),
                                          usebg = 'icon-20 icons use-'+ item.free;
                                    return  <li className="item" key={index}>
                                                <div className="item-img rel flex flex-a-c flex-j-c" onClick={() => onShowPreview(index)}>
                                                    <img src={imgSrc} alt="img" />
                                                </div>
                                                <div className="item-lien flex flex-a-c">
                                                    <p className="text-left flex-1 item-title" title={item.brandName}>{item.brandName}</p>
                                                    <p className="text-right flex-0" style={{"height":"22px"}}>
                                                        {
                                                            fileType ?
                                                                <i className={typeClass}>{fileType}</i>
                                                            :
                                                                null    
                                                        }
                                                    </p>
                                                </div>
                                                <div className="item-lien flex flex-a-c">
                                                    <p className="text-left flex-1">{item.applyCnName}</p>
                                                    {
                                                        !isEmpty(useData) ?
                                                            <p className="text-right flex-1 flex flex-a-c flex-j-e">
                                                                <i className={usebg}></i>
                                                                <span>{useData.text}</span>
                                                            </p>
                                                        :
                                                            null            
                                                    }                            
                                                </div>
                                            </li>
                                })
                            :   
                                <div style={{"fontSize": "14px","color": "#666", "textAlign": "center", "marginTop": "250px"}}>未搜索到相关图像素材</div> 
                        :
                            <div style={{"fontSize": "14px","color": "#666", "textAlign": "center", "marginTop": "250px"}}><img src="src/img/loading.gif" className="loading" />正在加载中...</div>                                                                                                                         
                    }
                </ul>
            </div>                 
        </div>
    )
  }
}