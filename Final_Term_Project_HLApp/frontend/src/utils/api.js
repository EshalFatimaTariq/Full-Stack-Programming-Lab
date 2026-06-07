import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api', // Points straight to your Node.js server
});

// Automatically inject our JWT token into the headers of every request if the user is logged in
if (typeof window !== 'undefined') {
    API.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });
}

export default API;