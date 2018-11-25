import axios from 'axios'
import {
    AUTH_SUCCESS,
    AUTH_LOGOUT
} from './actionTypes'

export function auth(email, password, isLogin) {
    return async dispatch => {
        const authData = {
            email,
            password,
            returnSecureToken: true
        }

        let url = '';

        if (isLogin) {
            url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyA19IU83EtA-HxpjV6slMHj29h9h1E3S3c';
        } else {
            url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyA19IU83EtA-HxpjV6slMHj29h9h1E3S3c';
        }

        try {
            const response = await axios.post(
                url,
                authData
            )
            const data = response.data
            // Sun Nov 25 2018 12:25:13 GMT+0300 (Moscow Standard Time) + data.expiresIn * 1000
            const expirationDate = new Date(new Date().getTime() + data.expiresIn * 1000)

            localStorage.setItem('token', data.idToken)
            localStorage.setItem('userId', data.localId)
            localStorage.setItem('expirationDate', expirationDate)

            dispatch(authSuccess(data.idToken))
            dispatch(autoLogout(data.expiresIn))

            console.log('AUTH', data)
        } catch (e) {
            console.log(e)
        }
    }
}

export function authSuccess(token) {
    return {
        type: AUTH_SUCCESS,
        token
    }
}

export function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('expirationDate')
    return {
        type: AUTH_LOGOUT
    }
}

export function autoLogin(time) {
    return dispatch => {
        const token = localStorage.getItem('token')
        if (!token) {
            dispatch(logout())
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'))
            if (expirationDate <= new Date()) {
                dispatch(logout())
            } else {
                dispatch(authSuccess(token))
                dispatch(autoLogout((expirationDate.getTime() - new Date().getTime()) / 1000))
            }
        }
        setTimeout(() => {
            dispatch(logout())
        }, time * 1000)
    }
}

export function autoLogout(time) {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout())
        }, time * 1000)
    }
}