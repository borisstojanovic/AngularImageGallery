import {
    ADD_IMAGE_SUCCESS,
    EDIT_IMAGE_SUCCESS,
    DELETE_IMAGE_SUCCESS,
} from "../actions/type";

const initialState = {
    image: {},
}

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case ADD_IMAGE_SUCCESS:
            return {
                image: payload.image
            };
        case EDIT_IMAGE_SUCCESS:
            return {
                image: payload.image
            };
        case DELETE_IMAGE_SUCCESS:
            return {
                image: {}
            };
        default:
            return state;
    }
}