import { combineReducers } from "redux";
import auth from "./auth";
import message from "./apiMessage";
import images from "./images";

export default combineReducers({
    auth,
    message,
    images
});