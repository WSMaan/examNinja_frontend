import axios from 'axios';

const BASE_URL = 'http://localhost:8081';
const REGISTER_URL = `${BASE_URL}/api/users/register`;
const LOGIN_URL = `${BASE_URL}/api/users/login`;
const TESTS_URL = `${BASE_URL}/api/tests/user`;


export const registerUser = async (userData) => {
    try {
        const response = axios.post(REGISTER_URL, userData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response;
        return data;
    } catch (error) {
        throw error;
    }
};
export const loginUser = async (userData) => {
    try {
        const response = axios.post(LOGIN_URL, userData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response;
        return data;
    } catch (error) {
        throw error;
    }
};



export const getTestsForUser = async (token) => {
    try {
        const response = await axios.get(TESTS_URL, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to load tests. Please try again later.');
    }
  };

export const resetPassword = async (values) => {
    return axios.put('/api/users/change-password', {
      email: values.email,
      password: values.password,
    });
  };

