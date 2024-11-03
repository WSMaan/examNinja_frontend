import axios from 'axios';

const BASE_URL = 'http://localhost:8081';
const REGISTER_URL = `${BASE_URL}/api/users/register`;
const LOGIN_URL = `${BASE_URL}/api/users/login`;
const RESETURL =`${BASE_URL}/api/users/reset-password`;
const CHANGEURL = `${BASE_URL}/api/users/change-password`;


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



export const resetPassword = async (userdata) => {
  try {
      const response = await axios.post(RESETURL, userdata, {
          headers: { 'Content-Type': 'application/json' },
      });
      return response.data; // Returning the actual data
  } catch (error) {
      throw error;
  }
};

const changePassword = async (email, oldPassword, newPassword) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/users/change-password`, {
      email,
      oldPassword,
      newPassword,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'An unexpected error occurred.');
    } else {
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }
};
  export default {
    changePassword,
  };

