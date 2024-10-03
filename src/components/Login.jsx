import React, { useState } from 'react';
import { Container, TextField, Button, Box, Typography, Card, Modal } from '@mui/material';
import { Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import Grid from '@mui/material/Grid';
import * as Yup from 'yup';
import axios from 'axios';
import { loginUser } from '../services/APIservice.jsx';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import '../styles/Registration.css';

// Validation schema for login
const validationSchema = Yup.object({
  email: Yup.string()
    .email('Enter a valid email address')
    .matches(/@.*\.com$/, 'Email must contain "@" and end with ".com"')
    .required('Email is required'),
  password: Yup.string()
    .test(
      'no-spaces-only',
      'Password cannot contain only spaces',
      (value) => value && value.trim().length > 0
    )
    .test(
      'trimmed-length',
      'Password must be between 8 and 15 characters',
      (value) => value && value.trim().length >= 8 && value.trim().length <= 15
    )
    .min(8, 'Password must be at least 8 characters')
    .max(15, 'Password must not exceed 15 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
    .required('Password is required'),
});


// Validation schema for reset password
const resetPasswordSchema = Yup.object({
  email: Yup.string()
    .email('Email should be valid')
    .required('Email is mandatory'),
  newPassword: Yup.string()
    .min(8, 'Password must be between 8 and 15 characters.')
    .max(15, 'Password must be between 8 and 15 characters.')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least 1 number.')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least 1 special character.')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required'),
});


const LoginPage = () => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [openResetModal, setOpenResetModal] = useState(false); // State for reset password modal
  const initialValues = {
    email: '',
    password: '',
  };

  const handleSubmit = async (values) => {
    try {
      const response = await loginUser(values);
      if (response && response?.status === 200 && response?.data?.status === "success") {
        setSuccessMessage('Success! You have logged in successfully');
        setErrorMessage(null);
      }
    } catch (error) {
      if (error && error?.status === 404 && error?.response?.data?.message === "User not found") {
        setSuccessMessage(null);
        setErrorMessage('No account associated with this email address. Please check your email or create a new account.');
      } else if (error?.status === 400) {
        const errorMessage = error?.response?.data?.message;
        if (errorMessage === "Incorrect password") {
          setErrorMessage('Oops! The password you entered is incorrect. Please try again.');
        } else if (error?.response?.data?.error?.password) {
          setErrorMessage(error?.response?.data?.error?.password);
        } else {
          setErrorMessage(errorMessage || 'An error occurred. Please try again.');
        }
      } else {
        setSuccessMessage(null);
        setErrorMessage('An unexpected error occurred. Please try again later.');
      }
    }
  };

  // Function to handle reset password form submission
  const handleResetPasswordSubmit = async (values) => {
    try {
      const response = await axios.put('/api/users/change-password', {
        email: values.email,
        password: values.newPassword,
      });
  
      if (response?.status === 200 && response?.data?.status === "success") {
        setSuccessMessage('Password changed successfully');
        setErrorMessage(null);
        setOpenResetModal(false); // Close modal after success
      }
    } catch (error) {
      if (error?.response?.status === 400) {
        const errorMessage = error?.response?.data?.error?.password || 'Validation failed. Please check your input.';
        setErrorMessage(errorMessage);
      } else if (error?.response?.status === 404) {
        setErrorMessage('User not found with the provided email.');
      } else {
        setErrorMessage('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <center>
      <Container maxWidth="sm">
        {successMessage && (
          <Stack sx={{ width: '100%', mt: 2 }} spacing={2}>
            <Alert severity="success">{successMessage}</Alert>
          </Stack>
        )}
        {errorMessage && (
          <Stack sx={{ width: '100%', mt: 2 }} spacing={2}>
            <Alert severity="error">{errorMessage}</Alert>
          </Stack>
        )}

        <Card sx={{ mt: 2 }}>
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" align="left" sx={{ fontWeight: 'bold' }}>Login</Typography>
            <Typography variant="body2" align="left" sx={{ mt: 1, mb: 2 }}>
              Doesn't have an account yet?{' '}
              <Link to="/" variant="body2" style={{ textDecoration: 'none', color: 'primary' }} className='Loginlink'>
                Register here
              </Link>
            </Typography>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, handleChange, handleBlur, values }) => (
                <Form style={{ width: '100%' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
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
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        id="pwd"
                        variant="outlined"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.password && Boolean(errors.password)}
                        helperText={touched.password && errors.password}
                      />
                    </Grid>
                    <Typography variant="body2" align="left">
                      <Button onClick={() => setOpenResetModal(true)} className='Loginlink'>
                        Forgot Password?
                      </Button>
                    </Typography>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3 }}
                  >
                    Login
                  </Button>
                </Form>
              )}
            </Formik>
          </Box>
        </Card>

        {/* Reset Password Modal */}
        <Modal open={openResetModal} onClose={() => setOpenResetModal(false)}>
          <Box sx={{ p: 4, backgroundColor: 'white', margin: 'auto', marginTop: '100px', width: '300px' }}>
            <Typography variant="h6" align="center">Reset Password</Typography>
            <Formik
              initialValues={{ email: '', newPassword: '', confirmPassword: '' }}
              validationSchema={resetPasswordSchema}
              onSubmit={handleResetPasswordSubmit}
            >
              {({ errors, touched, handleChange, handleBlur, values }) => (
                <Form style={{ width: '100%' }}>
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
                    margin="normal"
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
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    variant="outlined"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                    helperText={touched.confirmPassword && errors.confirmPassword}
                    margin="normal"
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2 }}
                  >
                    Reset Password
                  </Button>
                </Form>
              )}
            </Formik>
          </Box>
        </Modal>

      </Container>
    </center>
  );
};

export default LoginPage;
