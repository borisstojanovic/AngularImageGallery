import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    SET_MESSAGE,
} from "./type";

import AuthService from "../services/auth";

export const register = (username, email, password, password2, image) => (dispatch) => {
    return AuthService.register(username, email, password, password2, image).then(
        (response) => {
            dispatch({
                type: REGISTER_SUCCESS,
            });
            console.log(response)
            return Promise.resolve();
        },
        (error) => {
            console.log(error.message)
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();

            dispatch({
                type: REGISTER_FAIL,
            });

            dispatch({
                type: SET_MESSAGE,
                payload: message,
            });

            return Promise.reject();
        }
    );
};

export const login = (username, password) => (dispatch) => {
    return AuthService.login(username, password).then(
        (response) => {
            if (response.data) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }
            dispatch({
                type: LOGIN_SUCCESS,
                payload: { user: response.data },
            });

            return Promise.resolve();
        },
        (error) => {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();

            dispatch({
                type: LOGIN_FAIL,
            });

            dispatch({
                type: SET_MESSAGE,
                payload: message,
            });

            return Promise.reject();
        }
    );
};

export const logout = () => (dispatch) => {
    localStorage.removeItem("user");
    dispatch({
        type: LOGOUT,
    });
};