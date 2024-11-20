import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import TestScreen from '../components/TestScreen';
import ExamServices from '../services/ExamService'; // Mock the ExamService
import { BrowserRouter as Router, useParams } from 'react-router-dom';

// Mock ExamService API calls
jest.mock('../services/ExamService', () => ({
    getQuestionsForTest: jest.fn(),
    saveAnswer: jest.fn(),
    submitTest: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(() => ({ testId: '1' })), // Mock testId
}));

const { testId } = useParams();

const mockQuestions = {
    testName: 'Sample Test',
    questions: [
        {
            questionId: 'q1',
            question: 'What is 2 + 2?',
            option1: '3',
            option2: '4',
            option3: '5',
            option4: '6',
        },
    ],
    pageDetails: {
        pageNumber: 0,
        totalPages: 1,
        lastPage: true,
    },
};

describe('TestScreen Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock sessionStorage token
        sessionStorage.setItem('token', 'test-token');
    });

    afterEach(() => {
        sessionStorage.clear();
    });

    const setup = async () => {
        ExamServices.getQuestionsForTest.mockResolvedValue(mockQuestions);

        await act(async () => {
            render(
                <Router>
                    <TestScreen />
                </Router>
            );
        });
    };

    it('should render loading state initially', () => {
        render(
            <Router>
                <TestScreen />
            </Router>
        );
        expect(screen.getByText(/loading questions/i)).toBeInTheDocument();
    });

    it('should display the question and options after data is fetched', async () => {
        await setup();
        expect(screen.getByText('Sample Test')).toBeInTheDocument();
        expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument();
        expect(screen.getByLabelText('3')).toBeInTheDocument();
        expect(screen.getByLabelText('4')).toBeInTheDocument();
        expect(screen.getByLabelText('5')).toBeInTheDocument();
        expect(screen.getByLabelText('6')).toBeInTheDocument();
    });

    it('should allow selecting an answer', async () => {
        await setup();
        const option2 = screen.getByLabelText('4');
        fireEvent.click(option2);
        expect(option2).toBeChecked();
    });

   
});
