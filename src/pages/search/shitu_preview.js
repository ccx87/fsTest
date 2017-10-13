import React, { Component } from 'react';
import isEmpty from 'lodash.isempty'

import { Tool } from '../../js/config/tool'
import { FILE_USE } from '../../js/config/locaData'

class ShituPreview extends Component {
    constructor() {
        super();
        this.state = {};
        this.imgLoad = (img, callcack) => {
            const timer = setInterval(function () {
                if (img.complete) {//判断图片是否加载完成
                    callcack(img)
                    clearInterval(timer);
                }
            }, 50);
        }
        this.initImg = () => {
            const img = document.getElementById('previewImg'),
                  loading = document.getElementById('loadText');
            if( img ){
                img.style.display = 'none'
                loading.style.display = 'block'
                this.imgLoad(img, () => {
                    loading.style.display = 'none'
                    img.style.display = 'block'
                });
            }            
        }                     
    }
    componentDidMount() {
        //第一次加载图片时
        this.initImg() 
    }
    componentDidUpdate(nextProps) {
        if( nextProps.previewDataIndex !== this.props.previewDataIndex ){
            //重新加载图片时
            this.initImg()            
        }        
    }
    render() {
        const { previewDataIndex, previewData, onPrevPreview, onNextPreview, onClosePreview } = this.props
        const { loading } = this.state
        return (
            <div className="preview-layer">
                <div className="layer-content flex">
                    <div className="layer-left flex-1">
                        <div className="opt"></div>
                        <a className="close-layer" title="关闭预览" onClick={() => onClosePreview()}></a>
                        <div className="preview-list flex">
                            <div className="pl-left flex-0 flex flex-a-c flex-j-c">
                                <a className="prev" onClick={() => onPrevPreview()} title="上一张"></a>
                            </div>
                            <div className="pl-center flex-1 flex flex-a-c flex-j-c">
                                {
                                    previewData ?
                                        <a href={previewData.sourceUrl} target="_black">
                                            <img id="previewImg" className="pl-img" src={previewData.img} />
                                            <p id="loadText" className="no-data" style={{"fontSize":"12px"}}><img src="src/img/loading.gif" className="loading" />正在加载预览图...</p>
                                        </a>
                                    :
                                        <p className="no-data">没有可预览的图像</p>
                                }
                            </div>
                            <div className="pl-right flex-0 flex flex-a-c flex-j-c">
                                <a className="next" onClick={() => onNextPreview()} title="下一张"></a>
                            </div>                                                                
                        </div>
                    </div>
                    <div className="layer-right flex-0">
                        <p className="pi-title">{previewData && !isEmpty(previewData.title) ? previewData.title : '--' }</p>
                        <p className="pi-link"><a className="link" href={previewData && previewData.sourceUrl} target="_black">查看来源：{previewData && !isEmpty(previewData.sourceName) ? previewData.sourceName : '--'}</a></p>
                        {
                            previewData ?
                                previewData.free == 0 ?
                                    <p className="pi-info">版权：{FILE_USE[1].text}</p>
                                :
                                previewData.free == 1 ?
                                    <p className="pi-info">版权：{FILE_USE[2].text}</p>
                                :
                                    <p className="pi-info">版权：{FILE_USE[3].text}</p>    
                            :
                                null    
                        }
                        {
                            previewData && previewData.fileType ?
                                <p className="pi-info">格式：{previewData.fileType}</p>
                            :
                                null    
                        }
                        {
                            previewData && previewData.size ?
                                <p className="pi-info">尺寸：{previewData.size}</p>
                            :
                                null    
                        }
                        {
                            previewData && previewData.point != null ?
                                <p className="pi-info">价格：{previewData.point}</p>
                            :
                                null
                        }                                    
                    </div>
                </div>
            </div>
        )
    }
}
export default ShituPreview