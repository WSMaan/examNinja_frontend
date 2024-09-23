// src/RegistrationPage.js

import React, { useState } from 'react';
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Card
} from '@mui/material';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid2';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/APIservice.jsx';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import CreateAccountBanner from './CreateAccountBanner.jsx'
import '../styles/Registration.css';


const validationSchema = Yup.object({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string()
        .email('Enter a valid email address')
        .matches(/@gmail\.com$/, 'Email must be from the domain gmail.com')
        .required('Email is required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .max(15, 'Password must not exceed 15 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
});

const RegistrationPage = () => {
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const initialValues = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    };

    const handleSubmit = async (values) => {
        const { confirmPassword, ...userDetailsWithoutConfirmPassword } = values;

        try {
            const response = await registerUser(userDetailsWithoutConfirmPassword);
            if (response && response?.status == 201 && response?.data?.status == "success") {
                setSuccessMessage('Success! Your account has been created. You can now log in to your ExamNinja account.');
                setErrorMessage(null);
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
        } catch (error) {
            if (error.status == 400) {
                setSuccessMessage(null);
                if(error?.response?.data?.message == "User Already Exists with this Email!"){
                    setErrorMessage("Oops! This email is already registered. Please try another one or log in.");
                }
                else setErrorMessage(error?.response?.data?.message);
            }
        }
    };

    return (
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
                <Typography variant="subtitle1" align="center" className="subtitle" sx={{ fontWeight: 'bold' }}>
                    Join us and unlock your potential!
                </Typography>
                <CreateAccountBanner />
                <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ errors, touched, handleChange, handleBlur, values }) => (
                            <Form style={{ width: '100%' }}>
                                <Grid container spacing={2}>
                                    <Grid size={6}>
                                        <TextField
                                            fullWidth
                                            label="First Name"
                                            name="firstName"
                                            variant="outlined"
                                            value={values.firstName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.firstName && Boolean(errors.firstName)}
                                            helperText={touched.firstName && errors.firstName}
                                        />
                                    </Grid>
                                    <Grid size={6}>
                                        <TextField
                                            fullWidth
                                            label="Last Name"
                                            name="lastName"
                                            variant="outlined"
                                            value={values.lastName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.lastName && Boolean(errors.lastName)}
                                            helperText={touched.lastName && errors.lastName}
                                        />
                                    </Grid>
                                    <Grid size={12}>
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
                                    <Grid size={12}>
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
                                    <Grid size={12}>
                                        <TextField
                                            fullWidth
                                            label="Confirm Password"
                                            name="confirmPassword"
                                            type="password"
                                            id="confirmP"
                                            variant="outlined"
                                            value={values.confirmPassword}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                                            helperText={touched.confirmPassword && errors.confirmPassword}
                                        />
                                    </Grid>
                                </Grid>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3 }}
                                >
                                    Create Account
                                </Button>
                            </Form>
                        )}
                    </Formik>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                        Already have an account?{' '}
                        <Link to="/login" variant="body2" style={{ textDecoration: 'none', color: 'primary' }} className='Loginlink'>
                            Log In
                        </Link>
                    </Typography>
                </Box>
            </Card>
        </Container>
    );
}

export default RegistrationPage;
