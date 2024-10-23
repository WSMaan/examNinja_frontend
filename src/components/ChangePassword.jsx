import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, Stack } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import apiService from '../services/APIservice'; // Adjust the path as necessary

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  currentPassword: Yup.string()
    .required('Old password is required'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(15, 'Password must not exceed 15 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const ChangePassword = ({ onClose }) => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const initialValues = {
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  const handleSubmit = async (values) => {
    const { confirmPassword, ...userDetailsWithoutConfirmPassword } = values; // Exclude confirmPassword
    try {
      const response = await apiService.changePassword(
        userDetailsWithoutConfirmPassword.email,
        userDetailsWithoutConfirmPassword.currentPassword,
        userDetailsWithoutConfirmPassword.newPassword
      );
      if (response && response.status === 'success') { 
        setSuccessMessage(response.message);
        setErrorMessage(null);
        onClose(); // Close the modal after successful password change
      }
    } catch (error) {
      setSuccessMessage(null);
      setErrorMessage(error.message);
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Change Password
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

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, handleChange, handleBlur, values }) => (
          <Form>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              variant="outlined"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Old Password"
              name="currentPassword"
              type="password"
              variant="outlined"
              value={values.currentPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.currentPassword && Boolean(errors.currentPassword)}
              helperText={touched.currentPassword && errors.currentPassword}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="New Password"
              name="newPassword"
              type="password"
              variant="outlined"
              value={values.newPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.newPassword && Boolean(errors.newPassword)}
              helperText={touched.newPassword && errors.newPassword}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              variant="outlined"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.confirmPassword && Boolean(errors.confirmPassword)}
              helperText={touched.confirmPassword && errors.confirmPassword}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
            >
              Change Password
            </Button>
          </Form>
        )}
      </Formik>
      <Button
        fullWidth
        variant="outlined"
        onClick={onClose}
        sx={{ mt: 2 }}
      >
        Cancel
      </Button>
    </Box>
  );
};

export default ChangePassword;
