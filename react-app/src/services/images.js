import axios from "axios";
import FormData from "form-data";
import authMultipartHeader from "./auth-multipart-header";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/";

const getAll = () => {
    return axios.get(API_URL + "images/all", {headers: authHeader()});
};

const getAllPaginated = (page, size) => {
    return axios.get(API_URL + "images/paginated/" + page + "/" + size, {headers: authHeader()});
};

const getAllPaginatedSort = (page, size, sort) => {
    return axios.get(API_URL + "images/paginated/" + page + "/" + size + "/" + sort, {headers: authHeader()});
};

const getAllByTitle = (title, page, size, sort) => {
    return axios.get(API_URL + "images/getAllByTitle/" + title + "/" + page + "/" + size + "/" + sort, {headers: authHeader()});
};

const getAllForUser = (username, page, size, sort) => {
    return axios.get(API_URL + "images/getAllForUser/" + username + "/" + page + "/" + size + "/" + sort, {headers: authHeader()});
};

const deleteImage = (id) => {
    return axios.delete(API_URL + 'images/delete/' + id, {headers: authHeader()});
}

const editImage = (id, title, userId, description) => {
    let formData = new FormData();
    formData.append('title', title);
    formData.append('owner_id', userId);
    formData.append('description', description);
    return axios.put(API_URL + 'images/edit/' + id, formData, {headers: authMultipartHeader()});
};

const addImage = (title, userId, description, image) => {
    let formData = new FormData();
    formData.append('title', title);
    formData.append('owner_id', userId);
    formData.append('description', description);
    formData.append('image', image);
    return axios.post(API_URL + "images/add", image, {headers: authMultipartHeader()});
};

const updateImage = (id, title, userId, description, image) => {
    let formData = new FormData();
    formData.append('title', title);
    formData.append('owner_id', userId);
    formData.append('description', description);
    formData.append('image', image);
    return axios.put(API_URL + 'images/update/' + id, formData, {headers: authMultipartHeader()});
};

const like = (user_id, image_id, is_like) => {
    return axios.post(API_URL + "likes/add", {
        user_id: user_id,
        image_id: image_id,
        is_like: is_like
    }, {headers: authHeader()});
}

const removeLike = (user_id, image_id) => {
    return axios.delete(API_URL + "likes/remove/" + user_id + "/" + image_id,{headers: authHeader()});
}

const favorite = (user_id, image_id) => {
    return axios.post(API_URL + "favorites/add", {
        user_id: user_id,
        image_id: image_id,
    }, {headers: authHeader()});
}

const removeFavorite = (user_id, image_id) => {
    return axios.delete(API_URL + "favorites/remove/" + user_id + "/" + image_id,{headers: authHeader()});
}

const images = {
    getAll,
    getAllForUser,
    getAllByTitle,
    getAllPaginated,
    getAllPaginatedSort,
    addImage,
    editImage,
    updateImage,
    deleteImage,
    like,
    removeLike,
    favorite,
    removeFavorite
}

export default images;