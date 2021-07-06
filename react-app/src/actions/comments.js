import {
    SET_MESSAGE,
    DELETE_COMMENT_SUCCESS,
    EDIT_COMMENT_SUCCESS,
    ADD_COMMENT_SUCCESS,
    GET_COMMENTS_SUCCESS
} from "./type";

import CommentsService from "../services/comments";

const sendErrorMessage = (error, dispatch) =>{
    const message =
        (error.response &&
            error.response.data &&
            error.response.data.message) ||
        error.message ||
        error.toString();

    dispatch({
        type: SET_MESSAGE,
        payload: message,
    });
    dispatch({
        type: SET_MESSAGE,
        payload: message
    })
}

export const addComment = (image_id, content) => (dispatch) => {
    return CommentsService.addComment(image_id, content).then(
        (response) => {
            dispatch({
                type: ADD_COMMENT_SUCCESS,
                payload: { comment: response.data }
            });
            return Promise.resolve();
        },
        (error) => {
            sendErrorMessage(error, dispatch);
            return Promise.reject();
        }
    );
};

export const addNestedComment = (image_id, content, comment_id) => (dispatch) => {
    return CommentsService.addNestedComment(image_id, content, comment_id).then(
        (response) => {
            dispatch({
                type: ADD_COMMENT_SUCCESS,
                payload: { comment: response.data, comment_id: response.data.comment_id }
            });
            return Promise.resolve();
        },
        (error) => {
            sendErrorMessage(error, dispatch);
            return Promise.reject();
        }
    );
};

export const editComment = (id, content) => (dispatch) => {
    return CommentsService.editComment(id, content)
        .then((response) => {
                dispatch({
                    type: EDIT_COMMENT_SUCCESS,
                    payload: { comment: response.data },
                });

                return Promise.resolve();
            },
            (error) => {
                sendErrorMessage(error, dispatch);
                return Promise.reject();
            }
        );
};

export const getAllComments = () => (dispatch) => {
    return CommentsService.getAll()
        .then((response) => {
                dispatch({
                    type: GET_COMMENTS_SUCCESS,
                    payload: {
                        comments: response.data,
                        image_id: 0,
                    },
                });

                return Promise.resolve();
            },
            (error) => {
                sendErrorMessage(error, dispatch);
                return Promise.reject();
            }
        );
};

export const getAllCommentsPaginated = (image_id, startId, size) => (dispatch) => {
    return CommentsService.getAllPaginated(image_id, startId, size)
        .then((response) => {
                dispatch({
                    type: GET_COMMENTS_SUCCESS,
                    payload: {
                        comments: response.data,
                        image_id: image_id,
                        startId: startId
                    },
                });

                return Promise.resolve();
            },
            (error) => {
                sendErrorMessage(error, dispatch);
                return Promise.reject();
            }
        );
};

export const removeComment = (id) => (dispatch) => {
    return CommentsService.deleteComment(id)
        .then((response) => {
            if(response.data && response.data.comment_id === null){
                response.data.comment_id = undefined;
            }
            dispatch({
                type: DELETE_COMMENT_SUCCESS,
                payload: response.data,
            });
            return Promise.resolve();
        },
            (error) => {
                sendErrorMessage(error, dispatch);
                return Promise.reject();
            }
        );
};