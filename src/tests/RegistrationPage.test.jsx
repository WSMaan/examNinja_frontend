// src/RegistrationPage.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import RegistrationPage from '../components/Registration.jsx';

jest.mock('../services/APIservice.jsx'); // Mock the API service

describe('RegistrationPage', () => {
    beforeEach(() => {
        render(
            <Router>
                <RegistrationPage />
            </Router>
        );
    });

    test('renders the registration form', () => {
        expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    test('validates required fields', async () => {
        fireEvent.click(screen.getByRole('button', { name: /create account/i }));
        expect(await screen.findByText(/first name is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/last name is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    });
});

describe('RegistrationPage', () => {
    // Existing tests...

    test('matches snapshot', () => {
        const { asFragment } = render(
            <Router>
                <RegistrationPage />
            </Router>
        );
        expect(asFragment()).toMatchSnapshot();
    });
});