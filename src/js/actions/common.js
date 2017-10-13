import fetch from 'isomorphic-fetch'
import { target } from '../config/config'
import { Tool } from '../config/tool'
import * as constants from '../config/constants'

//开始获取数据
const requestPosts = path => {
    return {
        type: constants.REQUEST_POSTS,
        path
    }
}

//获取数据成功
export const receivePosts = (path, json, name) => {
    return {
        type: constants.RECEIVE_POSTS,
        path ,
        json ,
        name
    }
}

// 页面初次渲染时获取数据
export const fetchPosts = (path, postData, method, name) => {
    let url = target + path + Tool.paramType(postData);
    return dispatch => {
        dispatch(requestPosts(url));
        return fetch(url,{
            method: method,
            mode: 'cors',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
        .then(response => {
            if (response.ok) {
                response.json().then(json => dispatch(receivePosts(path, json, name)))
            } else {
                console.log("status", response.status);
                dispatch(receivePosts(path, {errorCode: 101, error:"连接超时"}, name))
            }
        })
        .catch(error => receivePosts(path, {errorCode: 101, error:"连接失败"}, name))
    }
}

//开始获取数据
const getDataStart = path => {
    //console.log('----getDataStart----', path)
    return {
        type: constants.GET_DATA_START,
        path
    }
}

//获取数据成功
const getDataSuccess = (path, json, name, success) => {
   // console.log('----getDataSuccess----', path, json, success, name)
    return {
        type: constants.GET_DATA_SUCCESS,
        path,
        json,
        name,
        success
    }
}

//手动调用获取数据的aciton
export const getData = (path, method, postData, name, success) => {
    //let url = target + path + Tool.paramType(postData);
    let paramData = Tool.paramType(postData);
    //JSON.stringify(postData)  
    return dispatch => {
        dispatch(getDataStart(path))
        if( method == 'post' ){
            paramData = paramData.split('?')[1];
            return fetch(path, {
                method: method,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                },
                mode: 'cors',
                body: paramData
            }).then(response => response.json())
              .then(json => dispatch(getDataSuccess(path, json, name, success )))
              .catch(error => dispatch(getDataSuccess(path, {errorCode:101,error:'连接失败'}, name)))
        }else{
            return fetch(path + paramData, {
                method: method,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                },
                mode: 'cors'
            }).then(response => response.json())
              .then(json => dispatch(getDataSuccess(path, json, name, success)))
              .catch(error => dispatch(getDataSuccess(path, {errorCode:101,error:'连接失败'}, name)))            
        }  
    }
}

