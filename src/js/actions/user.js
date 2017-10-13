import * as constants from '../config/constants'

export function login(data) {
    console.log(data)
    return {
        type: constants.USER_LOGGED_IN,
        payload: data
    }        
}

export function logout() {
    //删除
    localStorage.removeItem('token')
    return {
        type: constants.USER_LOGGED_OUT
    }
}

