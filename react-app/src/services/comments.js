import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/";

const get = (id) => {
    return axios.get(API_URL + "comments/comment" + id, {headers: authHeader()});
};

const getAll = () => {
    return axios.get(API_URL + "comments/all", {headers: authHeader()});
};

const getAllPaginated = (image_id, page, size) => {
    return axios.get(API_URL + "comments/image/paginated/" + image_id + "/" + page + "/" + size, {headers: authHeader()});
};

const deleteComment = (id) => {
    return axios.delete(API_URL + 'comments/' + id, {headers: authHeader()});
}

const addComment = (imageId, content) => {
    return axios.post(API_URL + "comments/comment", {
        image_id: imageId,
        content: content
    }, {headers: authHeader()});
};

const addNestedComment = (imageId, content, comment_id) => {
    return axios.post(API_URL + "comments/comment", {
        image_id: imageId,
        comment_id: comment_id,
        content: content
    }, {headers: authHeader()});
};

const editComment = (id, content) => {
    return axios.put(API_URL + "comments/edit/" + id, {content: content}, {headers: authHeader()});
};

const comments = {
    get,
    getAll,
    getAllPaginated,
    addComment,
    addNestedComment,
    editComment,
    deleteComment,
}

export default comments;