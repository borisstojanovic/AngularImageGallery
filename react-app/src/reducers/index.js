import { combineReducers } from "redux";
import auth from "./auth";
import message from "./apiMessage";
import images from "./images";
import singleImage from "./singleImage";
import comments from "./comments";

export default combineReducers({
    auth,
    message,
    images,
    comments,
    singleImage
});