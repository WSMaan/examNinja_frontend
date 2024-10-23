import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react'; // Import fireEvent and waitFor
import ResetPassword from '../components/ResetPassword.jsx'; // Adjust the import path as necessary
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('ResetPassword Component', () => {
  it('renders correctly', () => {
    const { asFragment } = render(<ResetPassword onClose={() => {}} />);
    expect(asFragment()).toMatchSnapshot(); // Create a snapshot
  });

  it('displays error message when email is invalid', async () => {
    const { getByLabelText, getByText } = render(<ResetPassword onClose={() => {}} />);
    
    // Fill in the email field with an invalid email
    const emailInput = getByLabelText(/Email Address/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput); // Trigger validation

    // Click the Continue button
    const submitButton = getByText(/Continue/i);
    fireEvent.click(submitButton);

    // Check for the error message
    expect(await waitFor(() => getByText(/Invalid email format/i))).toBeInTheDocument();
  });
  
  it('displays generated password on successful submission', async () => {
    // Mock axios to return a successful response
    axios.post.mockResolvedValueOnce({
      status: 200,
      data: { message: 'newPassword123' },
    });

    const { getByLabelText, getByText, findByText } = render(<ResetPassword onClose={() => {}} />);
    
    // Fill in a valid email and submit the form
    const emailInput = getByLabelText(/Email Address/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.blur(emailInput); // Trigger validation
    const submitButton = getByText(/Continue/i);
    fireEvent.click(submitButton);
    
    // Wait for the generated password to be displayed
    expect(await findByText(/newPassword123/i)).toBeInTheDocument();
  });
});
