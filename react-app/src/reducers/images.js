import {
    ADD_IMAGE_SUCCESS,
    ADD_IMAGE_FAIL,
    EDIT_IMAGE_SUCCESS,
    EDIT_IMAGE_FAIL,
    UPDATE_IMAGE_SUCCESS,
    UPDATE_IMAGE_FAIL,
    DELETE_IMAGE_SUCCESS,
    DELETE_IMAGE_FAIL,
    GET_IMAGES_SUCCESS,
    GET_IMAGES_FAIL
} from "../actions/type";

const initialState = {
    images: []
}

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case ADD_IMAGE_SUCCESS:
            return {
                ...state,
                images: [...state.images, payload.image]
            };
        case ADD_IMAGE_FAIL:
            return {
                ...state
            };
        case EDIT_IMAGE_SUCCESS:
            return {
                ...state,
                images: [
                    ...state.images.filter(image => image.id !== payload.image.id),
                    payload.image,
                ]
            };
        case EDIT_IMAGE_FAIL:
            return {
                ...state,
            };
        case DELETE_IMAGE_SUCCESS:
            return {
                ...state,
                images: state.images.filter(image => image.id !== payload.image.id),
            };
        case DELETE_IMAGE_FAIL:
            return {
                ...state,
            };
        case GET_IMAGES_SUCCESS:
            return {
                ...state,
                images: payload.images
            };
        case GET_IMAGES_FAIL:
            return {
                ...state,
                images: []
            };
        default:
            return state;
    }
}