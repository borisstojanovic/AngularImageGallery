import {
    ADD_COMMENT_SUCCESS,
    DELETE_COMMENT_SUCCESS,
    GET_COMMENTS_SUCCESS
} from "../actions/type";

const initialState = {
    comments: [],
    allLoaded: false,
    size: 10,
    imageId: 0
}

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case ADD_COMMENT_SUCCESS:
            return {
                ...state,
                //if comment is parent append it to the start of the state
                //otherwise adds it to the children object of that parent
                //children is an object of type {child_id: child, child_id2: child2...}
                comments: !payload.comment_id?[payload.comment, ...state.comments]:
                    state.comments.map((comment) => {
                        if(!comment.children){
                            comment.children = [];
                        }
                        if(comment.id === payload.comment_id){
                            comment.children.unshift(payload.comment);
                        }
                        return comment;
                }),
            };
        case DELETE_COMMENT_SUCCESS:
            return {
                ...state,
                comments: state.comments.map((comment) => {
                    if(comment.id === payload.id){
                        return null;
                    }
                    //check if comment has children
                    //if comment.id is equal to payload comment_id that means that comment is parent for payload
                    //in that case iterate through the children of comment and remove the payload from it
                    if(comment.children && comment.id === payload.comment_id){
                        comment.children = comment.children.filter((child) => child.id !== payload.id);
                    }
                    return comment;
                }),
            };
        case GET_COMMENTS_SUCCESS:
            return {
                ...state,
                //check if image was changed
                //if it wasn't changed simply append new comments to the list
                //otherwise replace all comments with the new ones
                comments: state.imageId === payload.image_id?
                    [...state.comments, ...payload.comments]:
                    payload.comments,
                imageId: payload.image_id,
                allLoaded: payload.comments.length < state.size || state.comments.length > 500 //allow max 500 comments to be loaded
                //since size will be 20 if fewer commets are returned it means there are no more comments to load
            };
        default:
            return state;
    }
}