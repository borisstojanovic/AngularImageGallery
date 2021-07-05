import {
    GET_IMAGES_PAGINATED_SUCCESS,
    GET_IMAGES_SUCCESS,
    LIKE_SUCCESS,
    DELETE_LIKE_SUCCESS,
    FAVORITE_SUCCESS,
    DELETE_FAVORITE_SUCCESS,
    CHANGE_SORT,
    DISLIKE_SUCCESS, ADD_VIEW_SUCCESS,
} from "../actions/type";

const initialState = {
    images: [],
    allLoaded: false,
    search: "",
    sort: "newest"
}

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case GET_IMAGES_SUCCESS:
            return {
                ...state,
                images: payload.images,
                allLoaded: true
            };
        case GET_IMAGES_PAGINATED_SUCCESS:
            return {
                ...state,
                //check if sorting parameter was changed or search was changed
                images: (state.sort === payload.sort && state.search === payload.search && payload.page!==1?
                    [...state.images , ...payload.images] : payload.images),
                allLoaded: (payload.images.length < 20 || state.images.length + payload.images.length >= 240),
                sort: payload.sort,
                search: payload.search
            };
        case CHANGE_SORT:
            return {
                ...state,
                sort: payload
            };
        case DISLIKE_SUCCESS:
            return {
                ...state,
                images: state.images.map(image => {
                    if(image.id === payload.image_id) {
                        //check if image was liked or disliked by the user previously
                        if(image.isLike){
                            image.likes -= 1;
                        }
                        image.dislikes += 1;
                        image.isLike = false;
                    }
                    return image;
                })
            };
        case LIKE_SUCCESS:
            return {
                ...state,
                images: state.images.map(image => {
                    if(image.id === payload.image_id) {
                        //check if image was liked or disliked by the user previously
                        if(image.isLike === false){
                            image.dislikes -= 1;
                        }
                        image.likes += 1;
                        image.isLike = true;
                    }
                    return image;
                })
            };
        case DELETE_LIKE_SUCCESS:
            return {
                ...state,
                images: state.images.map(image => {
                    if(image.id === payload.image_id) {
                        if(image.isLike){
                            image.likes-=1;
                        }else{
                            image.dislikes-=1;
                        }
                        image.isLike = null;
                    }
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
        case ADD_VIEW_SUCCESS:
            return {
                ...state,
                images: state.images.map(image => {
                    if(image.id === payload) image.views+=1;

                    return image;
                })
            };
        default:
            return state;
    }
}