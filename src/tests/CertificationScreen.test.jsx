import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import { act } from 'react';
import CertificationScreen from '../components/Quest.jsx'; // Adjust the import based on your file structure

// Mock the axios module
jest.mock('axios');

describe('CertificationScreen', () => {
    const mockTests = [
        { testId: 1, testName: 'Click here to start the Test Name - 50 Questions', numberOfQuestions: 50 },
        { testId: 2, testName: 'Another Test - 60 Questions', numberOfQuestions: 60 }
    ];

    // Mock sessionStorage to provide a token before all tests
    beforeAll(() => {
        sessionStorage.setItem('token', 'mockedToken');
    });

    beforeEach(() => {
        axios.get.mockResolvedValue({ data: mockTests });
    });

    test('renders the loading state initially', () => {
        render(
            <Router>
                <CertificationScreen />
            </Router>
        );
        expect(screen.getByText(/loading tests.../i)).toBeInTheDocument();
    });

    test('displays fetched tests after loading', async () => {
        await act(async () => {
            render(
                <Router>
                    <CertificationScreen />
                </Router>
            );
        });

        await waitFor(() => {
            expect(screen.getByText(/click here to start the test name - 50 questions/i)).toBeInTheDocument();
            expect(screen.getByText(/another test - 60 questions/i)).toBeInTheDocument();
        });
    });

    test('handles error state', async () => {
        axios.get.mockRejectedValue(new Error('Failed to load tests.'));

        await act(async () => {
            render(
                <Router>
                    <CertificationScreen />
                </Router>
            );
        });

        await waitFor(() => {
            expect(screen.getByText(/failed to load tests/i)).toBeInTheDocument();
        });
    });

    test('matches snapshot', () => {
        const { asFragment } = render(
            <Router>
                <CertificationScreen />
            </Router>
        );
        expect(asFragment()).toMatchSnapshot();
    });
});
