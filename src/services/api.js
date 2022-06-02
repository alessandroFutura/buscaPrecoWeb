import axios from "axios";

const api = axios.create({
    baseURL:"http://172.16.0.6/commercial3/"
});

export default api;