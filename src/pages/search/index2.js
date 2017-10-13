import React, { Component } from 'react'
import { connect } from 'react-redux'
import isEmpty from 'lodash.isempty'

import ShituTop from './shitu_top'
import ShituNav from './shitu_nav'
import ShituFilter from './shitu_filter'
import ShituList from './shitu_list'
import ShituPreview from './shitu_preview'

import { Tool } from '../../js/config/tool'
import { STID } from '../../js/config/api'
import { getData } from '../../js/actions/common'
import { SHITU_MODE, FORMAT_TYPE, FILE_USE, FILE_FROM, JIN_CHAN, IMG_TYPE_JPG, 
         IMG_TYPE_CONTENT, WEB_LIST } from '../../js/config/locaData'

const constant = {
    searchData: 'searchData',
    get: 'get',
    DEL: 'DEL',
    INIT: 'INIT',
    TYPE: 'TYPE',
    USE: 'USE',
    FROM: 'FROM',
    wisdomImageData: 'wisdomImageData',
    data: 'data',
    key: 'key',
    _preview_mode: 'preview-mode',
    script: 'script',
    xiuxiuJs: 'src/js/util/xiuxiu.js',
    firstMsg: '已经是第一张图像了',
    lastMsg: '已经是最后一张图像了'
}
class Search extends Component {
    constructor() {
        super();
        this.state = {
           uploadData: null,
           searchArray: null,
           searchData: null,
           previewDataIndex: null,
           imgTypeArray: null,
           imgUseArray: null,
           imgFromArray: null,
           useArray: null,
           fromArray: null,
           imgType: FORMAT_TYPE[0], //当前选择的格式
           imgUse: FILE_USE[0],
           imgFrom: FILE_FROM[0],
           filterArray: [],
           switchFilter: null,
           shituMode: SHITU_MODE.image           
        };
        this.navSwitchFilter = elem => {
            this.setState({
                switchFilter: elem
            })
        }
        this.getSearchData = res => {
            if( res.mode === SHITU_MODE.text ){
                this.setState({
                    uploadData: res,
                    shituMode: SHITU_MODE.text,
                    switchFilter: WEB_LIST.nitu
                })                               
            }else{
                if( res.errorCode == 0 ){
                    if(res.data){
                        const stId = res.data.map(item => item.stId)
                        this.props.getData(STID, constant.get, {stIds: stId.join(',')}, constant.searchData)
                    }
                }
                this.setState({
                    uploadData: res,
                    shituMode: SHITU_MODE.image,
                    switchFilter: null
                }) 
            }
        }
        this.navFilter = (key, elem) => {
            if( this.state.searchArray ){
                elem = elem || {}
                if( key != constant.DEL ){
                    elem[constant.key] = key;
                }
                let fa = this.state.filterArray
                if( key != constant.INIT ){
                    if( fa.length > 0 ){
                        let hasKey = false;
                        fa.forEach((item, index) => {
                            if( elem.default ){
                                if(item.key === key){
                                    hasKey = true
                                    fa.splice(index, 1)
                                }                                
                            }else{
                                if( key == constant.DEL ){
                                    const temp = item.key;
                                    if(item.key === elem.key){
                                        hasKey = true
                                        switch(temp){
                                            case constant.TYPE:
                                                elem = FORMAT_TYPE[0]
                                            break;
                                            case constant.USE:
                                                elem = FILE_USE[0]
                                            break;
                                            case constant.FROM:
                                                elem = FILE_FROM[0]
                                            break;        
                                        }
                                        elem[constant.key] = temp
                                        fa.splice(index, 1)
                                    }   
                                }else{
                                    if(item.key === key){
                                        hasKey = true
                                        fa.splice(index, 1, elem)
                                    }   
                                }                            
                            } 
                        })
                        if( !hasKey && !elem.default ) fa.push(elem);
                    }else{
                        if( !elem.default ){
                            fa.push(elem)
                        }
                    }
                } 
                switch(elem.key){
                    case constant.INIT:
                        this.setState({
                            imgType: FORMAT_TYPE[0],
                            filterArray: [],
                            imgUse: FILE_USE[0],
                            imgFrom: FILE_FROM[0],
                            searchData: this.filterTypeData(this.filterUseData(this.filterFromData(this.state.searchArray, FILE_FROM[0]), FILE_USE[0]), FORMAT_TYPE[0])
                        })                    
                    break;
                    case constant.TYPE:
                        this.setState({
                            imgType: elem,
                            filterArray: fa,
                            searchData: this.filterTypeData(this.filterUseData(this.filterFromData(this.state.searchArray, this.state.imgFrom), this.state.imgUse), elem)
                        })
                    break;
                    case constant.USE:
                        this.setState({
                            imgUse: elem,
                            filterArray: fa,
                            searchData: this.filterTypeData(this.filterUseData(this.filterFromData(this.state.searchArray, this.state.imgFrom), elem), this.state.imgType)
                        })                    
                    break;
                    case constant.FROM:
                        this.setState({
                            imgFrom: elem,
                            filterArray: fa,
                            searchData: this.filterTypeData(this.filterUseData(this.filterFromData(this.state.searchArray, elem), this.state.imgUse), this.state.imgType)
                        })                    
                    break;
                }
            }
        }
        this.reformattingType = arr => {
            //格式种类重组
            if( !arr ) return;
            const arrTypes = arr.map( item => item.fileType ),
                  formaTypes = Tool.cloneObj(FORMAT_TYPE);         
            arrTypes.forEach( ats => { 
                let hasFt = false
                if( !isEmpty(ats) ){ 
                    //去前后空格
                    ats = Tool.trim(ats)
                    for( let j = 0, lens = formaTypes.length; j < lens; j++ ){
                        if( formaTypes[j] && formaTypes[j].text && ats && formaTypes[j].text.toLowerCase() === ats.toLowerCase() ){
                            formaTypes[j].total++
                            formaTypes[0].total++
                            hasFt = true
                            break;
                        }else{
                            if( formaTypes[j].data ){
                                for( let i = 0, len = formaTypes[j].data.length; i < len; i ++ ){
                                    if( formaTypes[j].data[i] && ats && formaTypes[j].data[i].toLowerCase() === ats.toLowerCase() ){
                                        formaTypes[j].total++
                                        formaTypes[0].total++
                                        hasFt = true
                                        break;
                                    }                                    
                                }
                            }
                        }                       
                    }
                }
                if( !hasFt ){
                    //针对错误格式   
                    //针对其它格式        
                    formaTypes[formaTypes.length-1].total++
                    formaTypes[0].total++
                }               
            })
            this.setState({
                imgTypeArray: formaTypes.filter( fts => {return fts.total > 0 })
            })
        }
        this.refilesUse = arr => {
            //使用权重组
            if( !arr ) return;
            const arrTypes = arr.map( item => item.free ),
                  filesUse = Tool.cloneObj(FILE_USE);          
            arrTypes.forEach( ats => {  
                filesUse.forEach( fus => {
                    if( fus.value == ats ){
                        filesUse[0].total++
                        fus.total++
                    }
                })
            })
            const newUse = filesUse.filter( fus => {return fus.total > 0 })
            //imgUse: newUse[0],
            this.setState({
                imgUseArray: newUse
            })            
        }  
        this.refilesFrom = arr => {
            //来自某站重组
            if( !arr ) return;
            const arrTypes = arr.map( item => item.source ),
                  filesFrom = Tool.cloneObj(FILE_FROM); 
            arrTypes.forEach( ats => { 
                filesFrom.forEach( ffs => {
                    if( ffs.value == ats ){
                        ffs.total++
                        filesFrom[0].total++
                    }
                })
            })
            this.setState({
                imgFromArray: filesFrom.filter( ffs => {return ffs.total > 0 })
            })            
        }        
        this.filterTypeData = (newData, type) => {
            //过滤格式
            let filters = [];
            switch(type.value){
                case 0:
                   return newData
                break;
                case 4:
                    JIN_CHAN.forEach( jc => {
                        const newArr = this.addByValue( newData, jc );
                        if( newArr.length > 0 ){
                            filters.push(...newArr)
                        }
                    })
                break;
                case 7:
                    IMG_TYPE_JPG.forEach( jpg => {
                        const newArr = this.addByValue( newData, jpg );
                        if( newArr.length > 0 ){
                            filters.push(...newArr)
                        }
                    })
                break;
                case 100:
                    newData.forEach( item => {
                        const newArr = this.addNotByValue(IMG_TYPE_CONTENT, item);
                        if( newArr.length > 0 ){
                            filters.push(...newArr)
                        }                     
                    })
                break;
                default:
                    const newArr = this.addByValue( newData, type.text );
                    if( newArr.length > 0 ){
                        filters.push(...newArr)
                    }            
                break;
            }
            return filters;
        } 
        this.filterUseData = (arr, elem) => {
            if( !arr || arr.length == 0 ) return [];
            if( !elem || elem.default ) return arr;
            return arr.filter(item => {
                return item.free === elem.value
            })
        }
        this.filterFromData = (arr, elem) => {
            if( !arr || arr.length == 0 ) return [];
            if( !elem || elem.default ) return arr;    
            return arr.filter(item => {
                return item.source === elem.value 
            })            
        }
        this.addNotByValue = (arr, val) => {
            //其它，匹配规则刚好与addByValue相反
            if( !val ) return [];
            const type = val.fileType && Tool.trim(val.fileType)
            if( arr.some(item =>  item && type && item.toLowerCase() === type.toLowerCase()) ) 
                return [];
            return [val];
        }
        this.addByValue = (arr, val) => {
            //保留相同尾缀的图片
            const newData = arr.filter((item) => {
                const type = item.fileType && Tool.trim(item.fileType)
                return type && val && type.toLowerCase() === val.toLowerCase()
            });
            return newData         
        }                      
        this.getPreviewData = index => {
            if( this.state.searchData ){
                if( document.body ){
                    document.body.classList.add(constant._preview_mode)
                }
                this.setState({
                   previewDataIndex: index
                })
            }
        }
        this.prevPreview = () => {
            if( this.state.previewDataIndex != null ){
                if( this.state.previewDataIndex == 0 ){
                    Tool.alert(constant.firstMsg)
                }else{
                    const newIndex = this.state.previewDataIndex - 1
                    this.setState({
                        previewDataIndex: newIndex
                    })
                }
            }
        }
        this.nextPreview = () => {
            if( this.state.previewDataIndex != null ){
                if( this.state.previewDataIndex == this.state.searchData.length - 1 ){
                    Tool.alert(constant.lastMsg)
                }else{
                    const newIndex = this.state.previewDataIndex + 1
                    this.setState({
                        previewDataIndex: newIndex
                    })
                }
            }
        }        
        this.closePreview = () => {
            if( document.body ){
                document.body.classList.remove(constant._preview_mode)
            }            
            this.setState({
               previewDataIndex: null
            })            
        }
        this.getXiuxiuLoad = () => {
            const hm = document.createElement(constant.script);
            hm.src = constant.xiuxiuJs;
            const s = document.getElementsByTagName(constant.script)[0]; 
            s.parentNode.insertBefore(hm, s);            
        }
    }
    componentDidMount() {
        console.log('----SearchIndex----componentDidMount：',this.props) 
        console.log("=====智慧应用搜索缓存数据====", Tool.getLocal(constant.wisdomImageData))
        //读取缓存数据
        const inItLocal = Tool.getLocal(constant.wisdomImageData)
        if( inItLocal ){
            this.getSearchData(inItLocal)
        }
        if( _hmt ){
            //百度统计
            console.log('百度统计')
            _hmt.push(['_trackEvent', '智慧应用搜索', '图片搜索', '搜全部']); 
        } 
        //加载美图秀秀插件
        this.getXiuxiuLoad()

        //事件绑定
        //document.body.addEventListener('scroll', this.oneBodyScroll)             
    }  
    componentWillReceiveProps(nextProps) {
        console.log('-----SearchIndex----componentWillReceiveProps：',nextProps)
        let stateObj;
        if( nextProps.state && nextProps.state.send && nextProps.state.send.get ){
            stateObj = nextProps.state.send.get(constant.data)
        }
        console.log("=====智慧应用搜索新数据====", stateObj)
        if( stateObj ){
            if( stateObj.wisdomImageData ){
                this.getSearchData(stateObj.wisdomImageData.json)
                return
            }  
            if( stateObj.searchData ){
                const res = stateObj.searchData.json
                if( res.errorCode == 0 ){
                    //格式重组
                    this.reformattingType(res.data)
                    //使用权重组
                    this.refilesUse(res.data)
                    //来自某站重组
                    this.refilesFrom(res.data)
                    this.setState({
                        searchArray: res.data,
                        searchData: res.data
                    })
                }
            }
        }  
    } 
    componentWillUnmount() {
        //document.body.removeEventListener('scroll', this.oneBodyScroll)
    }    
    render() {
        const { uploadData, searchData, previewData, previewDataIndex, imgTypeArray, 
                useArray, fromArray, imgType, imgUse, imgFrom, filterArray,
                imgUseArray, imgFromArray, switchFilter, shituMode } = this.state
        let mtop, contentH;
        if( uploadData && uploadData.mode === SHITU_MODE.text ) {
            mtop = 152
        }else{
            if( switchFilter && switchFilter.keys ){
                mtop = 160
            }else{
                mtop = 200
            }            
        }
        contentH = Tool.dimensions().h - mtop - 200;     
        return (
            <div className="wisdom-image"> 
                <div className="wi-main">
                    <ShituTop 
                        switchFilter={switchFilter} 
                        uploadData={uploadData} 
                        onNavSwitchFilter={this.navSwitchFilter}/>
                    {
                        !switchFilter && shituMode === SHITU_MODE.image ?
                            <ShituNav 
                                uploadData={uploadData} 
                                imgTypeArray={imgTypeArray} 
                                imgUseArray={imgUseArray}
                                imgFromArray={imgFromArray}
                                onNavFilter={this.navFilter} 
                                useArray={useArray}
                                fromArray={fromArray}
                                imgType={imgType}
                                imgUse={imgUse}
                                imgFrom={imgFrom}
                                switchFilter={switchFilter}/>
                        :
                            null                                  
                    }

                    {
                        uploadData ?
                            <div className="shitu-result-content" style={{"marginTop": mtop +"px"}}>    
                                <ShituFilter 
                                    mode={uploadData.mode}
                                    keyWord={uploadData.keyWord}
                                    filterArray={filterArray} 
                                    onNavFilter={this.navFilter}
                                    switchFilter={switchFilter}
                                    onNavSwitchFilter={this.navSwitchFilter}/>
                                {
                                    shituMode === SHITU_MODE.image ?
                                        !switchFilter ?
                                            <div style={{"minHeight": contentH +"px"}}>
                                                <ShituList imgUseArray={imgUseArray} searchData={searchData} onShowPreview={this.getPreviewData}/>
                                            </div>
                                        :
                                            <div className="pic-data-list" style={{"minHeight": contentH +"px"}}>
                                                {/* 第三方图像网站 */}
                                                <p className="no-data">第三方图像网站</p>    
                                            </div>    
                                    :
                                        !switchFilter ?
                                            null
                                        :
                                            <div className="pic-data-list" style={{"minHeight": contentH +"px"}}>
                                                {/* 第三方图像网站 */}
                                                <p className="no-data">第三方图像网站</p> 
                                            </div>                               
                                }     
                            </div>
                        :
                            <div className="shitu-result-content flex flex-a-c flex-j-c">
                                <p className="no-data">未搜索到相关图像素材</p>
                            </div>    
                    }       
                </div>
                {
                    previewDataIndex != null && searchData ?
                        <ShituPreview 
                            previewDataIndex={previewDataIndex}
                            previewData={searchData[previewDataIndex]} 
                            onPrevPreview={this.prevPreview}
                            onNextPreview={this.nextPreview}
                            onClosePreview={this.closePreview}/>
                    :
                        null    
                }
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