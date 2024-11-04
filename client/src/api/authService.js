import axios from "axios"
import { API_URL } from "./constants"

export const getAllUsers = async () => {
    return await axios.get(`${API_URL}/auth/users/all`);
}

export const login = async (email, password) => {
    return await axios.post(`${API_URL}/auth/login`, {
        email: email,
        password: password,
    }, {
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    });
}

export const signup = async (data) => {
    return await axios.post(`${API_URL}/auth/signup`, data, {
        headers: {
            "Content-Type": "application/json",
        }
    })
}

export const deleteUser = async (emails) => {
    return await axios.delete(`${API_URL}/auth/users/delete`, {params: { emails }});
}
