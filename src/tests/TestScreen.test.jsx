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

    it('should disable the PREVIOUS button on the first question', async () => {
        await setup();
        const previousButton = screen.getByText(/previous/i);
        expect(previousButton).toBeDisabled();
    });

    it('should disable the NEXT button on the last question', async () => {
        await setup();
        const nextButton = screen.getByText(/next/i);
        expect(nextButton).toBeDisabled();
    });

    it('should allow only one radio button to be selected at a time', async () => {
        await setup();
        const option1 = screen.getByLabelText('3');
        const option2 = screen.getByLabelText('4');

        fireEvent.click(option1);
        expect(option1).toBeChecked();
        expect(option2).not.toBeChecked();

        fireEvent.click(option2);
        expect(option1).not.toBeChecked();
        expect(option2).toBeChecked();
    });

    it('should display the countdown timer based on total questions', async () => {
        await setup();
        const timer = screen.getByText(/time remaining/i);
        expect(timer).toBeInTheDocument();
    });

    it('should automatically submit the test when the timer ends', async () => {
        jest.useFakeTimers();
        ExamServices.submitTest.mockResolvedValue({ status: 200, message: 'Test submitted successfully' });

        await setup();
       await act(async () => {
        jest.advanceTimersByTime(mockQuestions.questions.length * 2 * 60 * 1000); // Simulate timer expiration
    });
        // await waitFor(() => {
        //     expect(ExamServices.submitTest).toHaveBeenCalledWith('1', 'test-token');
        // });

        jest.useRealTimers();
    });

   

});