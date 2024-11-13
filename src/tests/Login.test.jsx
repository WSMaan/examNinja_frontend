import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import LoginPage from '../components/Login.jsx'; // Adjust path if necessary
import { loginUser } from '../services/APIservice.jsx';

jest.mock('../services/APIservice'); // Mock loginUser API call

describe('LoginPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        sessionStorage.clear();

        render(
            <Router>
                <LoginPage />
            </Router>
        );
    });

    test('renders all components in the login form', () => {
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    test('validates required fields when submitting an empty form', async () => {
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(screen.getByText(/email is required/i)).toBeInTheDocument();
            expect(screen.getByText(/password is required/i)).toBeInTheDocument();
        });
    });

    test('handles successful login and stores token in session storage', async () => {
        const mockResponse = { data: { status: 'success', token: 'fakeToken' } };
        loginUser.mockResolvedValueOnce({ status: 200, ...mockResponse });

        await act(async () => {
            fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'testuser@test.com' } });
            fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password123!' } });
            fireEvent.click(screen.getByRole('button', { name: /login/i }));
        });

        expect(sessionStorage.getItem('token')).toBe('fakeToken');
        expect(await screen.findByText('Success! You have logged in successfully')).toBeInTheDocument(); // Use findByText for async checks
    });



    test('matches snapshot', () => {
        const { asFragment } = render(
            <Router>
                <LoginPage />
            </Router>
        );
        expect(asFragment()).toMatchSnapshot();
    });
});
