import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, Stack } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios'; // Import axios for API calls

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email format')
    .matches(/@.*\.com$/, 'Email must contain "@" and end with ".com"')
    .required('Email is mandatory'),
});

const ResetPassword = ({ onClose }) => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [generatedPassword, setGeneratedPassword] = useState(null);

  const initialValues = {
    email: '',
  };

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post('http://localhost:8081/api/users/reset-password', {
        email: values.email,
      });

      if (response && response.status === 200) {
        setGeneratedPassword(response.data.message); // Assuming the backend returns the new password in the message
        setErrorMessage(null);
        //setSuccessMessage('Password has been reset successfully.');
      }
    } catch (error) {
      setGeneratedPassword(null);
      if (error.response?.status === 400) {
        const errorMessage = error.response.data.message || 'Validation failed';
        setErrorMessage(errorMessage);
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
      setSuccessMessage(null);
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Forgot Password
      </Typography>

      {successMessage && (
        <Stack sx={{ width: '100%', mb: 2 }} spacing={2}>
          <Alert severity="success">{successMessage}</Alert>
        </Stack>
      )}
      {errorMessage && (
        <Stack sx={{ width: '100%', mb: 2 }} spacing={2}>
          <Alert severity="error">{errorMessage}</Alert>
        </Stack>
      )}

      {!generatedPassword ? (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, handleChange, handleBlur, values }) => (
            <Form>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                variant="outlined"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
              >
                Continue
              </Button>
            </Form>
          )}
        </Formik>
      ) : (
        <Stack sx={{ width: '100%', mb: 2 }} spacing={2}>
          <Alert severity="info">{generatedPassword}</Alert>
          <Button
            fullWidth
            variant="contained"
            onClick={onClose} // Close modal on clicking 'Okay'
            sx={{ mt: 2 }}
          >
            Okay
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default ResetPassword;
