import React, { Component } from 'react';

export default class ShituNav extends Component { 
    constructor() {
        super();
        this.state = {};
    }   
    componentDidMount() {

    }      
    render() {
      const { uploadData, imgTypeArray, imgUseArray, imgFromArray, onNavFilter, imgType, 
              imgUse, imgFrom } = this.props
      return (
          <div className="sm-nav z1 rel">
              <div className="container full-w-h flex">
                  <ul className="nav-left nav-ul full-h flex flex-a-c flex-0">
                      <li className="change-type">
                          <p className="p-line flex flex-a-c">
                             <i className="icon-20 icons type-bg"></i>
                             <span className="text">{imgType.subText}</span>
                             <i className="icon-10 icons more-bg"></i>
                          </p>
                          <ul className="sub-ul abs">
                             {
                                imgTypeArray && imgTypeArray.length > 0 ?
                                    imgTypeArray.map((item, index) => {
                                        let classes = null;
                                        //if( imgType && item && item.value == imgType.value ) classes = 'active'
                                        return  <li key={index} className={classes} onClick={() => onNavFilter('TYPE', item)}>
                                                    {item.subText}（{item.total}）
                                                </li>
                                    })
                                :
                                    null    
                             }
                          </ul>
                      </li>
                      <li className="change-color" style={{"display":"none"}}>
                          <p className="p-line flex flex-a-c">
                             <i className="icon-20 icons color-bg"></i>
                             <span className="text">所有颜色</span>
                             <i className="icon-10 icons more-bg"></i>
                          </p>                    
                          <ul className="sub-ul abs">
                             <li className="active default-change-color white"><i className="icon-20 icons"></i></li>
                             <li className="default-change-color gray"><i className="icon-20 icons"></i></li>
                             <li className="default-change-color black"><i className="icon-20 icons"></i></li>
                             <li className="active default-change-color red"><i className="icon-20 icons"></i></li>
                             <li className="default-change-color orange"><i className="icon-20 icons"></i></li>
                             <li className="default-change-color yellow"><i className="icon-20 icons"></i></li>
                             <li className="default-change-color green"><i className="icon-20 icons"></i></li>
                             <li className="default-change-color blue"><i className="icon-20 icons"></i></li>
                             <li className="default-change-color pink"><i className="icon-20 icons"></i></li>
                             <li className="default-change-color purple"><i className="icon-20 icons"></i></li>
                             <li className="default-change-color brown"><i className="icon-20 icons"></i></li>
                             <li className="default-change-color all"><i className="icon-20 icons"></i></li>
                          </ul>                        
                      </li>
                      <li className="change-sys">
                          <p className="p-line flex flex-a-c">
                             <i className="icon-20 icons sys-bg"></i>
                             <span className="text">{imgUse.text}</span>
                             <i className="icon-10 icons more-bg"></i>
                          </p>                    
                          <ul className="sub-ul abs">
                             {
                                  imgUseArray && imgUseArray.length > 0 ?
                                      imgUseArray.map((item, index) => {
                                          return <li key={index} onClick={() => onNavFilter('USE', item)}>{item.text}（{item.total}）</li>
                                      })
                                  :
                                      null    
                             }
                          </ul>                        
                      </li>
                      <li className="change-source">
                          <p className="p-line flex flex-a-c">
                             <i className="icon-20 icons source-bg"></i>
                             <span className="text">{imgFrom.text}</span>
                             <i className="icon-10 icons more-bg"></i>
                          </p>                     
                          <ul className="sub-ul abs">
                             {
                                  imgFromArray && imgFromArray.length > 0 ?
                                      imgFromArray.map((item, index) => {
                                          return <li key={index} onClick={() => onNavFilter('FROM', item)}>{item.text}（{item.total}）</li>
                                      })
                                  :
                                      null    
                             }                          
                          </ul>                        
                      </li>
                  </ul>                      
                  <div className="nav-right flex flex-a-c flex-j-e flex-1">
                      在超过<span className="sp-color">{uploadData ? uploadData.imgCount : 0}</span>个素材中搜索到<span className="sp-color">{uploadData && uploadData.data ? uploadData.data.length : 0}</span>个相似结果
                  </div>
              </div>                 
          </div>
      );
    } 
}