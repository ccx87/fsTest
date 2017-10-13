import Immutable from 'immutable'
import * as constants from '../config/constants'
//const initialState = Immutable.fromJS({}) //=Immutable.Map({})

const defaultlState = Immutable.fromJS({data: {}, isFetching: false}),
      getName = JSON.parse(localStorage.getItem('token')) || null;

export default function userUpdate(state = { name: getName }, { type, payload }) {
	//console.log('----reducers-----user：',state, type, payload)
    if(type === constants.USER_LOGGED_IN) {
        return payload
    } else if(type === constants.USER_LOGGED_OUT) {
        return {}
    }
    return state
}