import * as actionTypes from './actionTypes'
import axios from 'axios'

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = (authData) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        authData: authData
    }
}

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        erro: error
    }
}

export const auth = (email, password, isSingUP) => {

    return dispatch => {
        dispatch(authStart())
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        }
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBSmuvOeXSCxF8aRvtS3Yv4sJsGU1CikcQ'
        if (!isSingUP) {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBSmuvOeXSCxF8aRvtS3Yv4sJsGU1CikcQ'
        }
        axios.post(url, authData)
        .then(response =>{
            console.log(response)
            dispatch(authSuccess(response.data))
        })
        .catch(err => {
            console.log(err)
            dispatch(authFail(err))
        })
    }
}