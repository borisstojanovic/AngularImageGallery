import axios from "axios";
import FormData from "form-data";
import authMultipartHeader from "./auth-multipart-header";

const API_URL = "http://localhost:8080/auth/";

const register = (username, email, password, password2, image) => {
    let formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("password2", password2);
    formData.append("image", image);

    return axios.post(API_URL + "register", formData, {headers: authMultipartHeader()});
};

const login = (username, password) => {
    return axios.post(API_URL + "signin", { username: username, password: password })
};

const auth = {
    register,
    login
}

export default auth;