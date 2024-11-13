// CertificationScreen.test.jsx

// Suppress console.log and console.error for cleaner test output
jest.spyOn(console, 'log').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CertificationScreen from '../components/Quest.jsx';
import { BrowserRouter } from 'react-router-dom';
import { getTestsForUser } from '../services/ExamService';

// Mock the getTestsForUser function
jest.mock('../services/ExamService', () => ({
  getTestsForUser: jest.fn(),
}));

describe('CertificationScreen', () => {
  const renderComponent = () =>
    render(
      <BrowserRouter>
        <CertificationScreen />
      </BrowserRouter>
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('displays error message if user is not authenticated', async () => {
    sessionStorage.removeItem('token'); // Simulate no token in session
    renderComponent();
    await waitFor(() => expect(screen.getByText('User is not authenticated.')).toBeInTheDocument());
  });

  it('displays error message if fetching tests fails', async () => {
    sessionStorage.setItem('token', 'test-token'); // Set a valid token
    getTestsForUser.mockRejectedValue(new Error('Failed to load tests:'));

    renderComponent();

    await waitFor(() =>
      expect(screen.getByText('Failed to load tests. Please try again later.')).toBeInTheDocument()
    );
  });

  it('displays tests when fetched successfully', async () => {
    sessionStorage.setItem('token', 'test-token'); // Set a valid token
    const mockTests = [
      { testId: 1, testName: 'Java Test 1', numberOfQuestions: 10 },
      { testId: 2, testName: 'Java Test 2', numberOfQuestions: 15 },
    ];
    getTestsForUser.mockResolvedValue(mockTests);

    renderComponent();

    await waitFor(() => expect(screen.queryByText('Loading tests...')).not.toBeInTheDocument());

    mockTests.forEach((test) => {
      expect(
        screen.getByText(`Click here to start the ${test.testName} - ${test.numberOfQuestions} Questions`)
      ).toBeInTheDocument();
    });
  });

  it('navigates to test screen when a test is clicked', async () => {
    sessionStorage.setItem('token', 'test-token'); // Set a valid token
    const mockTests = [
      { testId: 1, testName: 'Java Test 1', numberOfQuestions: 10 },
    ];
    getTestsForUser.mockResolvedValue(mockTests);

    const { container } = renderComponent();

    await waitFor(() =>
      expect(screen.queryByText('Loading tests...')).not.toBeInTheDocument()
    );

    fireEvent.click(container.querySelector('.test-table'));

    expect(window.location.pathname).toBe(`/tests/${mockTests[0].testId}`);
  });
});
