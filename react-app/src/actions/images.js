import {
    ADD_IMAGE_SUCCESS,
    EDIT_IMAGE_SUCCESS,
    GET_IMAGES_SUCCESS,
    GET_IMAGE_SUCCESS,
    DELETE_IMAGE_SUCCESS,
    SET_MESSAGE,
    GET_IMAGES_PAGINATED_SUCCESS,
    LIKE_SUCCESS,
    DISLIKE_SUCCESS,
    DELETE_LIKE_SUCCESS,
    FAVORITE_SUCCESS,
    DELETE_FAVORITE_SUCCESS,
    CHANGE_SORT, ADD_VIEW_SUCCESS
} from "./type";

import ImagesService from "../services/images";

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

export const changeSort = (sort) => (dispatch) => {
    dispatch({
        type: CHANGE_SORT,
        payload: sort
    })
    return Promise.resolve();
}

export const add = (userId, title, description, image) => (dispatch) => {
    return ImagesService.addImage(title, userId, description, image).then(
        (response) => {
            dispatch({
                type: ADD_IMAGE_SUCCESS,
                payload: { image: response.data }
            });
            return Promise.resolve();
        },
        (error) => {
            sendErrorMessage(error, dispatch);
            return Promise.reject();
        }
    );
};

export const edit = (id, title, userId, description) => (dispatch) => {
    return ImagesService.editImage(id, title, userId, description)
        .then((response) => {
            dispatch({
                type: EDIT_IMAGE_SUCCESS,
                payload: { image: response.data },
            });

            return Promise.resolve();
        },
        (error) => {
            sendErrorMessage(error, dispatch);
            return Promise.reject();
        }
    );
};

export const update = (id, title, userId, description, image) => (dispatch) => {
    return ImagesService.updateImage(id, title, userId, description, image)
        .then((response) => {
                dispatch({
                    type: EDIT_IMAGE_SUCCESS,
                    payload: { image: response.data },
                });

                return Promise.resolve();
            },
            (error) => {
                sendErrorMessage(error, dispatch);
                return Promise.reject();
            }
        );
};

export const getAll = () => (dispatch) => {
    return ImagesService.getAll()
        .then((response) => {
                dispatch({
                    type: GET_IMAGES_SUCCESS,
                    payload: { images: response.data },
                });

                return Promise.resolve();
            },
            (error) => {
                sendErrorMessage(error, dispatch);
                return Promise.reject();
            }
        );
};

export const getImage = (id) => (dispatch) => {
    return ImagesService.get(id)
        .then((response) => {
                dispatch({
                    type: GET_IMAGE_SUCCESS,
                    payload: { image: response.data },
                });

                return Promise.resolve();
            },
            (error) => {
                sendErrorMessage(error, dispatch);
                return Promise.reject();
            }
        );
};

export const getAllPaginatedSort = (page, size, sort) => (dispatch) => {
    return ImagesService.getAllPaginatedSort(page, size, sort)
        .then((response) => {
                dispatch({
                    type: GET_IMAGES_PAGINATED_SUCCESS,
                    payload: { images: response.data, sort: sort, search: "", page: page },
                });

                return Promise.resolve();
            },
            (error) => {
                sendErrorMessage(error, dispatch);
                return Promise.reject();
            }
        );
};

export const getAllForUser = (username, page, size, sort) => (dispatch) => {
    return ImagesService.getAllForUser(username, page, size, sort)
        .then((response) => {
                dispatch({
                    type: GET_IMAGES_PAGINATED_SUCCESS,
                    payload: { images: response.data, sort: sort, search: username, page: page },
                });

                return Promise.resolve();
            },
            (error) => {
                sendErrorMessage(error, dispatch);
                return Promise.reject();
            }
        );
};

export const getAllByTitle = (title, page, size, sort) => (dispatch) => {
    return ImagesService.getAllByTitle(title, page, size, sort)
        .then((response) => {
                dispatch({
                    type: GET_IMAGES_PAGINATED_SUCCESS,
                    payload: { images: response.data, sort: sort, search: title, page: page },
                });

                return Promise.resolve();
            },
            (error) => {
                sendErrorMessage(error, dispatch);
                return Promise.reject();
            }
        );
};

export const remove = (id) => (dispatch) => {
    return ImagesService.deleteImage(id)
        .then((response) => {
                dispatch({
                    type: DELETE_IMAGE_SUCCESS,
                    payload: { image: response.data },
                });
                return Promise.resolve();
            },
            (error) => {
                sendErrorMessage(error, dispatch);
                return Promise.reject();
            }
        );
};

export const addViews = (image_id) => (dispatch) => {
    return ImagesService.addViews(image_id)
        .then((response) => {
                dispatch({
                    type: ADD_VIEW_SUCCESS,
                    payload: image_id,
                });
                return Promise.resolve();
            },
            (error) => {
                sendErrorMessage(error, dispatch);
                return Promise.reject();
            }
        );
};

export const addLike = (user_id, image_id, is_like) => (dispatch) => {
    return ImagesService.like(user_id, image_id, is_like)
        .then((response) => {
                if(response.data.is_like === 1){
                    dispatch({
                        type: LIKE_SUCCESS,
                        payload: response.data,
                    });
                }else{
                    dispatch({
                        type: DISLIKE_SUCCESS,
                        payload: response.data,
                    });
                }
                return Promise.resolve();
            },
            (error) => {
                sendErrorMessage(error, dispatch);
                return Promise.reject();
            }
        );
};

export const removeLike = (user_id, image_id) => (dispatch) => {
    return ImagesService.removeLike(user_id, image_id)
        .then((response) => {
                dispatch({
                    type: DELETE_LIKE_SUCCESS,
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

export const addFavorite = (user_id, image_id) => (dispatch) => {
    return ImagesService.favorite(user_id, image_id)
        .then((response) => {
                dispatch({
                    type: FAVORITE_SUCCESS,
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

export const removeFavorite = (user_id, image_id) => (dispatch) => {
    return ImagesService.removeFavorite(user_id, image_id)
        .then((response) => {
                dispatch({
                    type: DELETE_FAVORITE_SUCCESS,
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