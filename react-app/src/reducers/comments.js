import {
    ADD_COMMENT_SUCCESS,
    DELETE_COMMENT_SUCCESS,
    GET_COMMENTS_SUCCESS
} from "../actions/type";

const initialState = {
    comments: [],
    imageId: 0
}

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case ADD_COMMENT_SUCCESS:
            return {
                ...state,
                comments: [...state.comments, payload.comment],
                imageId: state.imageId
            };
        case DELETE_COMMENT_SUCCESS:
            return {
                ...state,
                //todo check if comment has children and delete them too
                comments: state.comments.filter(comment => comment.id !== payload.id),
                imageId: state.imageId
            };
        case GET_COMMENTS_SUCCESS:
            return {
                ...state,
                //check if image was changed
                //if it wasn't changed simply append new comments to the list
                //otherwise replace all comments with the new ones
                comments: state.imageId === payload.imageId?[...state.comments, ...payload.comments]:payload.comments,
                images: (state.sort === payload.sort && state.search === payload.search && payload.page!==1?
                    [...state.images , ...payload.images] : payload.images),
            };
        default:
            return state;
    }
}