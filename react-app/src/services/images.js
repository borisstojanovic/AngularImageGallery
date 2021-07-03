import axios from "axios";
import FormData from "form-data";

const API_URL = "http://localhost:8080/api/";

const getAll = () => {
    return axios.get(API_URL + "images", {withCredentials: true});
};

const getAllPaginated = (page, size) => {
    return axios.get(API_URL + "images/paginated/" + page + "/" + size, {withCredentials: true});
};

const getAllForUser = (id) => {
    return axios.get(API_URL + "images/" + id, {withCredentials: true});
};

const deleteImage = (id) => {
    return axios.delete(API_URL + 'image/' + id, {withCredentials: true});
}

const editImage = (id, userId, description) => {
    let formData = new FormData();
    formData.append('owner_id', userId);
    formData.append('description', description);
    return axios.put(API_URL + 'edit/' + id, formData, {
        withCredentials: true,
        headers: {
            'accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.8',
            'Content-Type': `multipart/form-data;`,
        }});
};

const addImage = (userId, description, image) => {
    let formData = new FormData();
    formData.append('owner_id', userId);
    formData.append('description', description);
    formData.append('image', image);
    return axios.post(API_URL + "images", image, {
        withCredentials: true,
        headers: {
            'accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.8',
            'Content-Type': `multipart/form-data;`,
        }});
};

const updateImage = (id, userId, description, image) => {
    let formData = new FormData();
    formData.append('owner_id', userId);
    formData.append('description', description);
    formData.append('image', image);
    return axios.put(API_URL + 'image/' + id, formData, {
        withCredentials: true,
        headers: {
            'accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.8',
            'Content-Type': `multipart/form-data;`,
        }});
};

const images = {
    getAll,
    getAllForUser,
    addImage,
    editImage,
    updateImage,
    deleteImage,
    getAllPaginated
}

export default images;