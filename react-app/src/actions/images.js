import {
    ADD_IMAGE_SUCCESS,
    EDIT_IMAGE_SUCCESS,
    GET_IMAGES_SUCCESS,
    DELETE_IMAGE_SUCCESS,
    SET_MESSAGE,
    GET_IMAGES_PAGINATED_SUCCESS,
    LIKE_SUCCESS,
    DELETE_LIKE_SUCCESS,
    FAVORITE_SUCCESS,
    DELETE_FAVORITE_SUCCESS
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

export const add = (userId, description, image) => (dispatch) => {
    return ImagesService.addImage(userId, description, image).then(
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

export const edit = (userId, description) => (dispatch) => {
    return ImagesService.editImage(userId, description)
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

export const update = (userId, description, image) => (dispatch) => {
    return ImagesService.updateImage(userId, description, image)
        .then((response) => {
                console.log(response)
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

export const getAllPaginatedSort = (page, size, sort) => (dispatch) => {
    console.log(sort)
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

export const getAllForUser = (userId, page, size, sort) => (dispatch) => {
    return ImagesService.getAllForUser(userId, page, size)
        .then((response) => {
                console.log(response)
                dispatch({
                    type: GET_IMAGES_PAGINATED_SUCCESS,
                    payload: { images: response.data, sort: sort, search: userId },
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
    console.log(title)
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

export const addLike = (user_id, image_id, is_like) => (dispatch) => {
    return ImagesService.like(user_id, image_id, is_like)
        .then((response) => {
                dispatch({
                    type: LIKE_SUCCESS,
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