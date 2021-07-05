import {
    ADD_COMMENT_SUCCESS,
    DELETE_COMMENT_SUCCESS,
    GET_COMMENTS_SUCCESS
} from "../actions/type";

const initialState = {
    comments: [],
    allLoaded: false,
    size: 20,
    imageId: 0
}

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case ADD_COMMENT_SUCCESS:
            return {
                ...state,
                //if comment is parent adds it into the existing list
                //otherwise adds it to the children list of that parent
                comments: !payload.comment_id?[...state.comments, payload.comment]:state.comments.map((comment) => {
                    if(comment.id === payload.comment_id){
                        comment.children[payload.comment_id] = payload;
                    }
                    return comment;
                }),
                imageId: state.imageId
            };
        case DELETE_COMMENT_SUCCESS:
            return {
                ...state,
                comments: state.comments.map((comment) => {
                    if(comment.id === payload.id){
                        return null;
                    }
                    if(comment.children && comment.children[payload.id]){
                        comment.children[payload.id] = undefined;
                    }
                    return comment;
                }),
                imageId: state.imageId
            };
        case GET_COMMENTS_SUCCESS:
            return {
                ...state,
                //check if image was changed
                //if it wasn't changed simply append new comments to the list
                //otherwise replace all comments with the new ones
                comments: state.imageId === payload.imageId?[...state.comments, ...payload.comments]:payload.comments,
                imageId: payload.imageId,
                allLoaded: payload.comments.length < state.size || state.comments.length > 500 //allow max 500 comments to be loaded
                //since size will be 20 if fewer commets are returned it means there are no more comments to load
            };
        default:
            return state;
    }
}