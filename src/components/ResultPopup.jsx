import React from 'react';
import { Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ResultPopup = ({ open, onClose, score, status, passingScore }) => {
  const navigate = useNavigate();

  const handleReviewClick = () => {
    onClose(); // Close the popup
    navigate('/Quest'); // Redirect to the review screen
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle align='center'>Test Results - {status}</DialogTitle>
      <DialogContent>
        <Typography variant="h6" align='center'>You scored: {score}% </Typography>
        {/* <Typography variant="subtitle1">Status: {status}</Typography> */}
        <Typography variant="subtitle2" align='center'> <hr/>
          Passing Score: {passingScore}% 
          <br/> {status === 'PASS' ? 'Congratulations!' : 'Better luck next time.'}
          <br/>Review Functionality Coming soon...
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleReviewClick} color="primary" variant="contained" >
          Test Screen
        </Button>
        <Button onClick={onClose} color="secondary" >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResultPopup;
