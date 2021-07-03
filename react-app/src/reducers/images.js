import {
    ADD_IMAGE_SUCCESS,
    EDIT_IMAGE_SUCCESS,
    GET_IMAGES_PAGINATED_SUCCESS,
    DELETE_IMAGE_SUCCESS,
    GET_IMAGES_SUCCESS,
    LIKE_SUCCESS,
    DELETE_LIKE_SUCCESS,
    FAVORITE_SUCCESS,
    DELETE_FAVORITE_SUCCESS
} from "../actions/type";

const initialState = {
    images: [],
    page: 1,
    size: 20,
    allLoaded: false
}

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case ADD_IMAGE_SUCCESS:
            return {
                ...state,
                images: [...state.images, payload.image]
            };
        case EDIT_IMAGE_SUCCESS:
            return {
                ...state,
                images: [
                    ...state.images.filter(image => image.id !== payload.image.id),
                    payload.image,
                ]
            };
        case DELETE_IMAGE_SUCCESS:
            return {
                ...state,
                images: state.images.filter(image => image.id !== payload.image.id),
            };
        case GET_IMAGES_SUCCESS:
            return {
                ...state,
                images: payload.images,
                page: 1,
                size: 20,
                allLoaded: true
            };
        case GET_IMAGES_PAGINATED_SUCCESS:
            return {
                ...state,
                images: [...state.images , ...payload.images],
                page: state.page + 1,
                allLoaded: (payload.images.length < 20 || state.images.length + payload.images.length >= 240),
            };
        case LIKE_SUCCESS:
            return {
                ...state,
                images: state.images.map(image => {
                    if(image.id === payload.image_id) image.isLike = payload.is_like === 1;
                    return image;
                })
            };
        case DELETE_LIKE_SUCCESS:
            return {
                ...state,
                images: state.images.map(image => {
                    if(image.id === payload.image_id) image.isLike = null;
                    return image;
                })
            };
        case FAVORITE_SUCCESS:
            return {
                ...state,
                images: state.images.map(image => {
                    if(image.id === payload.image_id) image.isFavorite = true;

                    return image;
                })
            };
        case DELETE_FAVORITE_SUCCESS:
            return {
                ...state,
                images: state.images.map(image => {
                    if(image.id === payload.image_id) image.isFavorite = false;

                    return image;
                })
            };
        default:
            return state;
    }
}