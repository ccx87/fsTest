import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, hashHistory, browserHistory } from 'react-router'
import isEmpty from 'lodash.isempty'

import { getData, receivePosts } from '../../js/actions/common'
import { Tool } from '../../js/config/tool'
import { STUPLOAD } from '../../js/config/api'
import { SHITU_MODE } from '../../js/config/locaData'

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploader: null,
            thumbnailWidth: 100,
            thumbnailHeight: 100,
            keyWord: null
        }
        this.eventsKeyDown = (event) => {
            const keyCode = window.event ? event.keyCode : event.which;
            if( keyCode == 13 ) {
                this.textMode()
            }
        }
        this.textMode = () => {
            const wordDom = document.querySelector('.sb-input');
            if( wordDom ){
                const text = wordDom.value
                if( isEmpty(text) ){
                    Tool.alert('请输入关键字搜索商标')
                    return
                }           
                const data = {
                    keyWord: text,
                    mode: SHITU_MODE.text
                }
                Tool.removeLocal('trademackData')
                Tool.setLocal('trademackData', data)
                this.setState({
                    keyWord: text
                })                          
                if( this.props.noJump ){
                    this.props.receivePosts('关键字搜索商标，自动触发的数据流', data, 'trademackData')
                }else{
                    browserHistory.push('/search')
                }                
            }
        }        	
    }    
    componentDidMount() {
        //console.log('-----SearchBar----componentDidMount：', this.props)
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
            pick: '#filePicker',  
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
                            Tool.removeLocal('trademackData')
                            Tool.setLocal('trademackData', callback)
                            if( target.props.noJump ){
                                target.props.receivePosts('此path为商标上传识图成功后返回，自动触发的数据流', callback, 'trademackData')
                            }else{
                                browserHistory.push('/search')
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
    componentWillMount() {
        //读取缓存数据
        if( this.props.noJump ){
            const inItLocal = Tool.getLocal('trademackData')
            if( inItLocal ){
                this.setState({
                    keyWord: inItLocal.keyWord
                }) 
            }        
        }        
    } 
    componentDidUpdate() {
        if( !this.state.keyWord ){
            const wordDom = document.querySelector('.sb-input');
            if( wordDom ){
                wordDom.value = '';
            }
        }
    }   
    render() {
        const { keyWord } = this.state
	    return (
            <div className="search-bar rel" onKeyDown={this.eventsKeyDown}>
                <input type="text" className="sb-input" defaultValue={keyWord} placeholder="" />
                <button type="button" className="sb-btn default-bg" onClick={this.textMode}>搜索商标</button>
                <div id="filePicker"></div>
                <div className="abs change" title="点击上传图片">
                    <img src="src/img/search-bg.png" />
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
export default connect(select, {getData, receivePosts})(SearchBar)