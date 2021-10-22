import {Action} from "@ngrx/store";

export const LOGIN_START = '[Auth] Login Start';
export const SIGNUP_START = '[Auth] Signup Start';
export const AUTHENTICATE_SUCCESS = '[Auth] Authenticate Success';
export const AUTHENTICATE_FAIL = '[Auth] Authenticate Fail';
export const LOGOUT = '[Auth] Logout';
export const HANDLE_ERROR = '[Auth] Handle Error';
export const AUTO_LOGIN = '[Auth] Auto Login';

export class LoginStart implements Action {
  readonly type = LOGIN_START;

  constructor(public payload: {
    username: string,
    password: string
  }) {
  }
}

export class SignupStart implements Action {
  readonly type = SIGNUP_START;

  constructor(public payload: {
    username: string,
    password: string,
    email: string,
    image: File
  }) {
  }
}

export type AuthActions = LoginStart | SignupStart
