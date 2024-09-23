import React from 'react';
import { Box, Typography } from '@mui/material';
import crtAccount from '../assets/images/createaccount.jpg'; // Replace with your image path

const CreateAccountBanner = () => {
    return (
        <Box
            sx={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '130px', // Adjust height as needed
                backgroundImage: `url(${crtAccount})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '0px',
                overflow: 'hidden',
            }}
        >
            <Typography
                variant="h4"
                component="h2"
                sx={{
                    width: '100%',
                    position: 'absolute',
                    color: 'white',
                    textAlign: 'center',
                    padding: '1rem',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: adds a background for better readability
                    borderRadius: '4px',
                }}
            >
                Create Your ExamNinja Account
            </Typography>
        </Box>
    );
};

export default CreateAccountBanner;
