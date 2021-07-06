import {
    ADD_IMAGE_SUCCESS,
    EDIT_IMAGE_SUCCESS,
    DELETE_IMAGE_SUCCESS,
    GET_IMAGE_SUCCESS,
    FAVORITE_SUCCESS,
    DELETE_FAVORITE_SUCCESS,
    LIKE_SUCCESS,
    DELETE_LIKE_SUCCESS,
    DISLIKE_SUCCESS,
    ADD_VIEW_SUCCESS
} from "../actions/type";

const initialState = {
    image: {},
}

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case ADD_IMAGE_SUCCESS:
            return {
                ...state,
                image: payload.image
            };
        case EDIT_IMAGE_SUCCESS:
            return {
                ...state,
                image: payload.image
            };
        case DELETE_IMAGE_SUCCESS:
            return {
                ...state,
                image: {}
            };
        case GET_IMAGE_SUCCESS:
            return {
                ...state,
                image: payload.image,
                comments: []
            }
        case FAVORITE_SUCCESS:
            return {
                ...state,
                image: {
                    ...state.image,
                    isFavorite: true
                }
            }
        case DELETE_FAVORITE_SUCCESS:
            return {
                ...state,
                image: {
                    ...state.image,
                    isFavorite: false
                }
            }
        case DISLIKE_SUCCESS:
            return {
                ...state,
                image: {
                    ...state.image,
                    likes: state.image.isLike===true?state.image.likes-1:state.image.likes,
                    dislikes: state.image.dislikes+1,
                    isLike: false
                }
            };
        case LIKE_SUCCESS:
            return {
                ...state,
                image: {
                    ...state.image,
                    likes: state.image.likes + 1,
                    dislikes: state.image.isLike===false?state.image.dislikes-1:state.image.dislikes,
                    isLike: true
                }
            };

        case DELETE_LIKE_SUCCESS:
            return {
                ...state,
                image: {
                    ...state.image,
                    likes: state.image.isLike===true?state.image.likes-1:state.image.likes,
                    dislikes: state.image.isLike===false?state.image.dislikes-1:state.image.dislikes,
                    isLike: null
                }
            };

        case ADD_VIEW_SUCCESS:
            return {
                ...state,
                image: {
                    ...state.image,
                    views: state.image.views+=1
                }
            }
        default:
            return state;
    }
}