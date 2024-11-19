// ExamServices.jsx
import axios from 'axios';

const BASE_URL = 'http://localhost:8081';
const TESTS_URL = `${BASE_URL}/api/tests/user`;
const EXAM_URL = `${BASE_URL}/api/tests`;


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

// Function to fetch questions for a specific test and page
export const getQuestionsForTest = async (testId, page, token) => {
  try {
    const response = await axios.get(`${EXAM_URL}/${testId}/questions?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data; // Return the questions data
  } catch (error) {
    throw new Error('Failed to load questions. Please try again later.');
  }
};

// Function to save the selected answer for a specific question

export const saveAnswer = async (questionId, testId, selectedAnswer, token) => {
  const payload = {
    questionId: questionId,
    testId: testId,
    selectedOption: selectedAnswer,

  };

  try {
    const response = await axios.post(`${EXAM_URL}/save`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Check if the response indicates success
    if (response.status !== 200) {
      throw new Error('Failed to save answer. Please try again.');
    }
    
    return response.data; // Return the response data if needed
  } catch (error) {
    throw new Error(error.response?.data?.message || 'An error occurred while saving the answer.');
  }
};

// Exporting the functions
export default {
  getQuestionsForTest,
  saveAnswer,
};


