import React, { Component } from 'react';

import { connect } from 'react-redux'
import { Link, hashHistory } from 'react-router';

import { WEB_LIST, SHITU_MODE } from '../../js/config/locaData'
import { Tool } from '../../js/config/tool'
import { STUPLOAD } from '../../js/config/api'
import { receivePosts } from '../../js/actions/common'

const wd1 =[WEB_LIST.sogou, WEB_LIST.google, WEB_LIST.tineye],
      wd2 = [WEB_LIST.nitu, WEB_LIST.wotu, WEB_LIST.qiantu, WEB_LIST.google, WEB_LIST.img360, WEB_LIST.shutterstock, WEB_LIST.sogou];
class ShituTop extends Component { 
    constructor() {
        super();
        this.state = {
            shitMode: SHITU_MODE.image,
            webData: wd1
        }
        this.updateWebData = (mode) => {
            this.setState({
                shitMode: mode || SHITU_MODE.image,
                webData: mode === SHITU_MODE.text ? wd2 : wd1
            })
        }
        this.showShituSelectArea = () => {
            var target = this;
            var areaDOM = this.refs.shituSelectArea;
            if( areaDOM ){
                var bn = Tool.getStyle(areaDOM, 'display');
                var loadDom = document.getElementById('imgLoad');
                if(bn == "none"){
                    areaDOM.style.display = "block";
                    if(xiuxiu){
                        //实例化图片处理API
                        xiuxiu.setLaunchVars("customMenu", [{"decorate":["basicEdit"]}]);
                        var dms = Tool.dimensions(),
                            _w = dms && dms.h > 700 ? 600 : 500,
                            _h = dms && dms.h > 700 ? 400 : 300;
                        console.log('xiuxiu宽高：', _w, _h);    
                        /*第1个参数是加载编辑器div容器，第2个参数是编辑器类型，第3个参数是div容器宽，第4个参数是div容器高*/
                        xiuxiu.embedSWF("altContent2", 1, _w, _h);
                        //修改为您自己的图片上传接口
                        xiuxiu.setUploadURL(STUPLOAD);
                        xiuxiu.setUploadType(2);
                        xiuxiu.setUploadDataFieldName("file");
                        xiuxiu.onInit = function (id){
                            if( loadDom ){
                                loadDom.style.display = 'none';
                            }
                            xiuxiu.loadPhoto(target.props.uploadData.orgUrl);                   
                        }
                        xiuxiu.onBeforeUpload = function (data, id){
                          var size = data.size;
                          if(size > 2 * 1024 * 1024){ 
                             Tool.alert("图片不能超过2M"); 
                             return false; 
                          }
                          xiuxiu.setUploadArgs({commitPsnId: target.props.isAuthenticated || 654}, id);
                          return true; 
                        }                        
                        xiuxiu.onUploadResponse = function (data){
                            //alert("上传响应" + data);
                            data = eval( "(" +data+ ")");
                            console.log("美图秀秀上传响应：",data)
                            if( data && data.errorCode == 0 ){
                                 data['mode'] = SHITU_MODE.image
                                if( data.data && data.data.length > 0 ){
                                    Tool.removeLocal('uploadData')
                                    Tool.setLocal('uploadData', data)
                                    target.props.receivePosts('此path为上传识图成功后返回，自动触发的数据流', data, 'uploadData')                          
                                }
                                target.closeSelectArea();
                            }else{
                                Tool.alert(data.error || '识图失败！');
                            }                            
                        }
                        xiuxiu.onDebug = function (data){
                            Tool.alert("错误响应" + data);
                        }
                        xiuxiu.onClose = function (id){
                            //alert(id + "关闭");
                            //clearFlash();
                            target.closeSelectArea();
                        }
                        //清除flash
                        function clearFlash(){
                            document.getElementById("flashEditorOut").innerHTML='<div id="flashEditorContent"><p><a href="http://www.adobe.com/go/getflashplayer"><img alt="Get Adobe Flash player" src="http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif"></a></p></div>';
                        }  
                    }else{
                        Tool.alert("flash加载失败");
                        areaDOM.style.display = "none";  
                    }             
                }else{
                    areaDOM.style.display = "none";
                    if( loadDom ){
                        loadDom.style.display = 'block';
                    }
                }
            }       
        }
        this.closeSelectArea = () => {
            var areaDOM = this.refs.shituSelectArea;
            if(areaDOM){
                areaDOM.style.display = "none";
                $("#imgLoad").show();
            }
        }  
    } 
    componentDidMount() {
        if( this.props.uploadData ){
            this.updateWebData(this.props.uploadData.mode)
        } 
    }
    componentWillReceiveProps(nextProps) {
        if( (nextProps.uploadData && !this.props.uploadData) || 
            (nextProps.uploadData && this.props.uploadData && nextProps.uploadData.mode !== this.props.uploadData.mode) ){
            this.updateWebData(nextProps.uploadData.mode)
        }
    }
    render() {
        const { uploadData, onNavSwitchFilter, switchFilter } = this.props
        const { shitMode, webData } = this.state
        return (
            <div className="sm-top">
                <div className="container full-w-h flex flex-a-c">
                    {
                        shitMode === SHITU_MODE.image ?
                            <div className="top-left flex-0 flex flex-a-c flex-j-c" style={ !uploadData || !uploadData.orgUrl ? {"border": "1px solid #E1E1E1"} : null}>              
                                <div className="top-left-img">
                                    <img src={uploadData ? uploadData.orgUrl : "src/img/upload-failt.png"} alt="预览图" style={{"fontSize":"13px","color":"#666"}}/>
                                    <div className="img-tool">
                                        <div className="opt"></div>
                                        <a className="button" onClick={this.showShituSelectArea}><i className="icon-20 icons tool-pic"></i>图像调整</a>
                                    </div>
                                </div>
                                <div className="shitu-select-area" ref="shituSelectArea">
                                    <div className="fn-use-msg">
                                        <p className="col-red">水哥提示：调整图像可以提高识图准确度。</p>
                                        <div className="area-close" title="关闭窗口" onClick={this.closeSelectArea}><i className="icon-20 icons shit-area-close"></i></div>
                                    </div>  
                                    <div id="flashEditorOut">
                                        <img id="imgLoad" className="abs-load-bg" alt="正在加载中，请稍候" src="src/img/loading.gif"/>
                                        <div id="altContent2">
                                        </div>
                                    </div>
                                </div>                
                            </div>
                        :
                            null                            
                    }

                    <div className="top-right flex-1" style={{"height": shitMode === SHITU_MODE.image ? "120px" : "auto"}}>
                        {
                            shitMode === SHITU_MODE.image ?
                                uploadData ?
                                    <div className="right-top">
                                        <p className="text">
                                            <span className="t-l">尺寸</span>
                                            <span className="t-r">{uploadData ? uploadData.imgWidth +" × "+ uploadData.imgHeight : "--"}</span>
                                        </p>
                                        <p className="text" style={{"display":"none"}}>
                                            <span className="t-l">主色调</span>
                                            {
                                                uploadData && uploadData.tonality ?
                                                    <span className="t-r">
                                                        <a href="javascript:;" className="color green">
                                                           <i></i>绿色
                                                        </a>
                                                        <a href="javascript:;" className="color white"><i></i>白色</a>
                                                        <a href="javascript:;" className="color red"><i></i>红色</a> 
                                                    </span>
                                                :
                                                    <span className="t-r">无</span>                                    
                                            }

                                        </p>
                                    </div>
                                :
                                    <div className="right-top flex flex-a-c" style={{"height":"100%", "color":"red"}}>
                                        <p className="upload-failt col-red">识图超时，请重新上传图片</p>
                                    </div>
                            :
                                uploadData ?
                                    <div className="right-top">
                                        <p className="text">
                                           关键字“{uploadData.keyWord}”的搜索结果：
                                        </p>
                                    </div>
                                :
                                    <div className="right-top flex flex-a-c" style={{"height":"100%", "color":"red"}}>
                                        <p className="upload-failt col-red">识图超时，请重新输入关键字</p>
                                    </div>                                                     
                        }
                        {
                            uploadData ? 
                                <div className="right-bottom" style={{"marginTop":uploadData.mode === SHITU_MODE.image ? "23px" : "10px"}}>
                                    
                                    {
                                        uploadData.mode === SHITU_MODE.image ?
                                            <p className="text">没有满意结果？试试搜其它引擎</p>
                                        :
                                            null    
                                    }
                                    <p className="b-a flex">
                                        {
                                            webData ?
                                                webData.map((item, index) => {
                                                    let classes = item.classes
                                                    if( switchFilter && switchFilter.value === item.value ){
                                                        classes += ' active'
                                                    }
                                                    return <a key={index} className={classes} onClick={() => onNavSwitchFilter(item)}>{item.text}</a>
                                                })
                                            :
                                                null    
                                        }
                                    </p>
                                </div>
                            :
                                null    
                        }
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
export default connect(select, {receivePosts})(ShituTop)