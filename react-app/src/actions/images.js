import {
    ADD_IMAGE_SUCCESS,
    ADD_IMAGE_FAIL,
    EDIT_IMAGE_SUCCESS,
    EDIT_IMAGE_FAIL,
    GET_IMAGES_SUCCESS,
    GET_IMAGES_FAIL,
    DELETE_IMAGE_SUCCESS,
    DELETE_IMAGE_FAIL,
    SET_MESSAGE, GET_IMAGES_PAGINATED_SUCCESS, GET_IMAGES_PAGINATED_FAIL,
} from "./type";

import ImagesService from "../services/images";

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
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();

            dispatch({
                type: ADD_IMAGE_FAIL,
            });

            dispatch({
                type: SET_MESSAGE,
                payload: message,
            });

            return Promise.reject();
        }
    );
};

export const edit = (userId, description) => (dispatch) => {
    return ImagesService.editImage(userId, description)
        .then((response) => {
            console.log(response)
            dispatch({
                type: EDIT_IMAGE_SUCCESS,
                payload: { image: response.data },
            });

            return Promise.resolve();
        },
        (error) => {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();

            dispatch({
                type: EDIT_IMAGE_FAIL,
            });

            dispatch({
                type: SET_MESSAGE,
                payload: message,
            });

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
                const message =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                dispatch({
                    type: EDIT_IMAGE_FAIL,
                });

                dispatch({
                    type: SET_MESSAGE,
                    payload: message,
                });

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
                const message =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                dispatch({
                    type: GET_IMAGES_FAIL,
                });

                dispatch({
                    type: SET_MESSAGE,
                    payload: message,
                });

                return Promise.reject();
            }
        );
};

export const getAllPaginated = (page, size) => (dispatch) => {
    return ImagesService.getAllPaginated(page, size)
        .then((response) => {
                dispatch({
                    type: GET_IMAGES_PAGINATED_SUCCESS,
                    payload: { images: response.data },
                });

                return Promise.resolve();
            },
            (error) => {
                const message =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                dispatch({
                    type: GET_IMAGES_PAGINATED_FAIL,
                });

                dispatch({
                    type: SET_MESSAGE,
                    payload: message,
                });

                return Promise.reject();
            }
        );
};

export const getAllForUser = (userId) => (dispatch) => {
    return ImagesService.getAllForUser(userId)
        .then((response) => {
                console.log(response)
                dispatch({
                    type: GET_IMAGES_SUCCESS,
                    payload: { images: response.data },
                });

                return Promise.resolve();
            },
            (error) => {
                const message =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                dispatch({
                    type: GET_IMAGES_FAIL,
                });

                dispatch({
                    type: SET_MESSAGE,
                    payload: message,
                });

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
                const message =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                dispatch({
                    type: DELETE_IMAGE_FAIL,
                });

                dispatch({
                    type: SET_MESSAGE,
                    payload: message,
                });

                return Promise.reject();
            }
        );
};