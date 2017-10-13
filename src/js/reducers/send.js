import Immutable from 'immutable'
import * as constants from '../config/constants'
//const initialState = Immutable.fromJS({}) //=Immutable.Map({})

const defaultlState = Immutable.fromJS({data: {}, isFetching: false})

//首次渲染时获取数据
// export default function fetchData (state = defaultlState , action = {}) {
//     switch(action.type){
//         case constants.REQUEST_POSTS:
//             return state.set('isFetching',true);
//         case constants.RECEIVE_POSTS:
//             return Immutable.Map({'data':action.json,'isFetching':false});//返回一个新的state
//         default:
//             return state
//     }
// }

//手动获取数据
export default function requestData (state = {}, action = {}) {
    //console.log('-----reducers------send：', state, action)
    switch(action.type){
        case constants.REQUEST_POSTS:
            return state.set('isFetching',true);
        case constants.RECEIVE_POSTS:
            state[action.name] = action;
            return Immutable.Map({data:state});      
        case constants.GET_DATA_START:
            return state;
        case constants.GET_DATA_SUCCESS:
            if( action.success ){
                action.success(action.json || {});
            }
            state[action.name] = action;
            return Immutable.Map({data: state})
            //return state;
        default:
            return state;
    }
}

// export const testData = (state = {}, action = {}) => {
//     switch(action.type){
//         case constants.TEST_DISPATCH:
//             return Object.assign({},state,action);
//         default:
//             return state;
//     }
// }

// //记录商品列表页数据状态
// export const producRecord = (state = {}, action = {}) => {
//     switch(action.type){
//         case constants.RECORD_STATE:
//             return Object.assign({},state,action);
//         case constants.SAVE_PRODUCT_LIST:
//             state['productList'] = [...action.productList];
//             return state;       //记录商品列表数据，但是不触发组件更新
//         case constants.NEW_PRODUCT_DATA:
//             state['productData'] = [...action.productData];
//             return state;
//         default:
//             return state 
//     }
// }

// //销售记录页面数据
// export const saleRecord = (state = Immutable.fromJS({}) , action = {}) => {
//     switch(action.type){
//         case constants.DELETE_ITEM:
//             return Immutable.Map({index:action.index})
//         default:
//             return state;
//     }
// }



