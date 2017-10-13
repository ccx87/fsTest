import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Link, hashHistory, browserHistory } from 'react-router'
import isEmpty from 'lodash.isempty'

import { getData, receivePosts } from '../../js/actions/common'
import { Tool } from '../../js/config/tool'
import { STUPLOAD } from '../../js/config/api'
import { SHITU_MODE } from '../../js/config/locaData'

class Index2 extends Component {
    constructor() {
        super();
        this.state = {
            searchArea: 1,
            uploadObj: null,
            fileList: null,
            hover: false,
            switMode: 1,
            keyWord: null
        };
        this.eventsKeyDown = (event) => {
            const keyCode = window.event ? event.keyCode : event.which;
            if( keyCode == 13 ) {
                this.textMode()
            }
        }
        this.textMode = () => {
            const wordDom = this.refs.inputText;
            if( wordDom ){
                const text = wordDom.value
                if( isEmpty(text) ){
                    Tool.alert('请输入关键字搜索')
                    return
                }           
                const data = {
                    keyWord: text,
                    mode: SHITU_MODE.text
                }
                Tool.removeLocal('wisdomImageData')
                Tool.setLocal('wisdomImageData', data)
                this.setState({
                    keyWord: text
                })                          
                if( this.props.noJump ){
                    this.props.receivePosts('智慧应用关键字搜索，自动触发的数据流', data, 'wisdomImageData')
                }else{
                    browserHistory.push('/search2')
                }                
            }
        }
        this.urlMode = () => {
            Tool.alert('网络图片搜索功能正在开发中')
            return
        }
        this.cancelClick = () => {
            if(this.state.uploadObj){
                if(this.state.fileList && this.state.fileList.length > 0){
                    this.state.uploadObj.reset();
                    this.state.uploadObj.cancelFile(this.state.fileList[0]);
                    this.state.uploadObj.removeFile(this.state.fileList[0], true);
                }
            }
            $('#FOSHAN_SEARCH_PC').removeClass('webuploader-dnd-over');
            $('.g-top .drag-laod').hide();
            $('.g-top .drag-text').text('拖拽图片到此处或按Ctrl+V试试');
            $('.g-top .drag-close').hide();      
        }
        this.selectShituMode = (falg, event) => {
            this.setState({
                hover: false
            })
            var $elem = $('.shitu-panel');
            this.state.switMode = falg;
            if(falg == SHITU_MODE.text){
                $(event.target).closest($elem).removeClass('add-1-scale').addClass('add-time add-0-scale');
                $(event.target).closest($elem).siblings($elem).fadeIn();
            
            }else{
                $(event.target).closest($elem).siblings($elem).removeClass('add-0-scale').addClass('add-time add-1-scale');
                $(event.target).closest($elem).fadeOut(800);
                
            }       
        }
    }
    componentDidMount() {
        console.log('----Home----componentDidMount：',this.props)
        this.state.uploader = WebUploader.create({  
            // 选完文件后，是否自动上传。  
            auto: true,  
            // swf文件路径  
            swf: 'src/js/util/Uploader.swf',  
            // 文件接收服务端。  
            server: STUPLOAD,  
            // 选择文件的按钮。可选。  
            // 内部根据当前运行是创建，可能是input元素，也可能是flash. 
            dnd: document.body, //指定Drag And Drop拖拽的容器，如果不指定，则不启动
            disableGlobalDnd: true, //是否禁掉整个页面的拖拽功能，如果不禁用，图片拖进来的时候会默认被浏览器打开。
            paste: document.body, //指定监听paste事件的容器，如果不指定，不启用此功能。此功能为通过粘贴来添加截屏的图片。建议设置为document.body. 
            pick: '#fileAddBtn',  
            // 只允许选择图片文件。  
            accept: {  
                title: 'Images',  
                extensions: 'gif,jpg,jpeg,bmp,png',  
                mimeTypes: '.png,.jpg,.jpeg,.gif,.bmp,.PNG,.JPG,.JPEG,.GIF,.BMP'  
            },  
            method:'POST',
            fileNumLimit: 1 //验证文件总数量, 超出则不允许加入队列。  
        });
        if( this.state.uploader ) {
            const target = this;
            // 当有文件添加进来的时候 
            // webuploader事件.当选择文件后，文件被加载到文件队列中，触发该事件。等效于 uploader.onFileueued = function(file){...} ，类似js的事件定义。 
            this.state.uploader.on( 'fileQueued', function( file ) { 
                target.state.keyWord = null 
                Tool.alert('正在上传图片...', null, 1000*60*10);
            });             
            //当某个文件在发送前触发，主要用来询问是否要添加附带参数
            this.state.uploader.on( 'uploadBeforeSend', function(block, data, headers) { 
                //1=商标识图、2=柜机与自行车识图、3=个人网盘识图             
                data["stType"] = 1;
            }); 
            // 文件上传成功  
            this.state.uploader.on( 'uploadSuccess', function( file, callback ) {  
                console.log('上传的图片：', file)
                console.log('上传返回的数据：', callback)
                if( callback && callback.errorCode == 0 ){
                    callback['mode'] = SHITU_MODE.image
                    if( callback.errorCode == 0 ){
                        if( callback.data && callback.data.length > 0 ){
                            Tool.alert('正在上传图片...', null, 1);
                            Tool.removeLocal('wisdomImageData')
                            Tool.setLocal('wisdomImageData', callback)
                            if( target.props.noJump ){
                                target.props.receivePosts('此path为智慧应用上传识图成功后返回，自动触发的数据流', callback, 'wisdomImageData')
                            }else{
                                browserHistory.push('/search2')
                            }
                            return;                            
                        }
                    }else{
                        Tool.alert(callback.error || '识图失败！');
                    }
                }else{
                    Tool.alert(callback.error || '识图失败！');
                }
             });  
            // 文件上传失败，显示上传出错。  
            this.state.uploader.on( 'uploadError', function( file ) { 
                Tool.alert('服务器异常：上传失败'); 
            });
            // 完成上传完了，成功或者失败，初始化上传参数。  
            this.state.uploader.on( 'uploadComplete', function( file ) { 
                target.state.uploader.reset();
            });                                   
        }
    }    
    renderOptHtml(text) {
        return  <div className="opt">
                    <div className="drag-here">
                        <div className="dh">
                            <div className="drag-div">
                                <img className="drag-laod" src="src/img/loading.gif" draggable="false"/>
                                <span className="drag-text">{text}</span>
                            </div>     
                            <i className="shitu-icon drag-bg drag-bg-1"></i>
                            <i className="shitu-icon drag-bg drag-bg-2"></i>
                            <i className="shitu-icon drag-bg drag-bg-3"></i>
                            <i className="shitu-icon drag-bg drag-bg-4"></i>
                        </div>
                    </div>
                    <div className="drag-close" onClick={this.cancelClick}><i className="shitu-icon drag-bg-close"></i></div>
                </div>
    }    
    render() {
        //isAuthenticated = 用户ID
        return (
            <div className="home"> 
                <div className="g-top">
                    {/* 图片搜索 */}
                    <div className="shitu-panel img-mode" ref="shituPanel" id="imageSearchView">                                           
                        <div className="abs-opt"></div>
                        {this.renderOptHtml('拖拽图片到此处试试')}
                        <div className="stdiv">
                        <div className='abs-opt'></div>
                        <div className='fontClick' onClick={this.selectShituMode.bind(this, SHITU_MODE.text)}>进入文字搜图</div>
                        <div className="stdiv-inner">
                            <div className="stupload" id="fileAddBtn" ref="fileAddBtn">
                                 上传图片
                            </div>
                            <span className='vertical-bar'></span>
                            <div className="sturl">
                                <div className="stinput">
                                    <input type="text" id="inputUrl" placeholder="http://粘贴图片地址" disabled={true} autoComplete="off" className="st-input" name="inputurl" ref="inputUrl" />
                                    <div className="stsuccess right">
                                        <i className="index-imgs shitu-select-img" onClick={this.selectShituMode.bind(this, SHITU_MODE.text)}></i>
                                        <div className="opt-abs-msg" onClick={this.selectShituMode.bind(this, SHITU_MODE.text)}><i></i><span>按文字搜图</span></div>
                                    </div>                                                         
                                </div>
                                <div className="stbtn">    
                                    <button className="st-btn st-all st-select" data-code="2" onClick={this.urlMode}>识图一下</button>
                                </div>
                                </div>
                            </div> 
                            <div className="drag-text-tip">拖拽图片到此处或按Ctrl+V试试</div>
                        </div>
                    </div>
                    {/* 文字搜索 */}
                    <div className="shitu-panel text-mode" ref="shituPanel" id="textSearchView" onKeyDown={this.eventsKeyDown}>
                        {this.renderOptHtml('正在切换文字搜图模式')} 
                        <div className="stdiv">
                            <div className='abs-opt'></div>
                            <div className='fontClick1' onClick={this.selectShituMode.bind(this, SHITU_MODE.image)}>进入图片识图</div>
                            <div className="sturl">
                                <div className="stinput">
                                    <input type="text" id="inputText" placeholder="输入文件名、标题、标签等关键字搜索图片" autoComplete="off" className="st-input" name="inputtext" ref="inputText" />
                                    <div className="stsuccess right">
                                        <i className="index-imgs shitu-select-text"  onClick={this.selectShituMode.bind(this, SHITU_MODE.image)}></i>
                                        <i className="index-imgs shitu-select-sanjiao"> </i>
                                        <div className="opt-abs-msg" onClick={this.selectShituMode.bind(this, SHITU_MODE.image)}><i></i><span>按图片搜图</span></div>
                                    </div>                                                            
                                </div>
                                <div className="stbtn">   
                                    <button className="st-btn st-all" onClick={this.textMode}>搜图一下</button>
                                </div>
                            </div>    
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
export default connect(select, {getData, receivePosts})(Index2)