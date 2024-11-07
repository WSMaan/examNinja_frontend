import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, Radio, RadioGroup, FormControlLabel, Button, Checkbox, Grid } from '@mui/material';
import axios from 'axios';
import TabsComponent from '../components/Tabs.jsx'; // Import the TabsComponent
import ExamServices from '../services/ExamService.jsx';

const TestScreen = () => {
  const { testId } = useParams();
  const [questions, setQuestions] = useState([]); // Store questions array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageDetails, setPageDetails] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [marked, setMarked] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0); // Timer in seconds
  const [activeTab, setActiveTab] = useState(2); // State to manage active tab
  const [testName, setTestName] = useState(''); // New state for test name
  const [isTestSubmitted, setIsTestSubmitted] = useState(false); // State to track if the test is submitted


  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD
  const formattedTime = currentDate.toLocaleTimeString('en-GB', { hour: '2-digit', 
    minute: '2-digit', 
    hour12: false  }); 
  useEffect(() => {
    const fetchQuestions = async (page) => {
      setLoading(true);
      setError(null);

      const token = sessionStorage.getItem('token');
      console.log(`Token: ${token}`);
      if (!token) {
        setLoading(false);
        setError('User is not authenticated.');
        return;
      }

      try {
        const data = await ExamServices.getQuestionsForTest(testId, page, token);
        setTestName(data.testName);
        setQuestions(data.questions);
        setPageDetails(data.pageDetails);
        setSelectedAnswer(data.questions[0]?.selectedOption || '');
        setMarked(false);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions(currentPage);
  }, [testId, currentPage]);

  useEffect(() => {
    const totalQuestions = pageDetails?.totalPages || 0;
    const totalTime = totalQuestions * 2 * 60; // Total time for the test in seconds
    if (timeRemaining === 0 && !isTestSubmitted) {
      setTimeRemaining(totalTime);
    }
  }, [pageDetails, timeRemaining, isTestSubmitted]);

  useEffect(() => {
  if (timeRemaining > 0 && !isTestSubmitted) {
    const timer = setInterval(() => {
      if (timeRemaining === 1) {
        handleSubmitTest(); // Trigger submission at 0 seconds
      }
      setTimeRemaining((prevTime) => prevTime - 1); // Decrement time
    }, 1000);

    return () => clearInterval(timer);
  }
}, [timeRemaining, isTestSubmitted]);

  useEffect(() => {
    if (questions.length > 0) {
      const questionId = questions[0]?.questionId;
      console.log(`Loaded question ${questionId}: ${selectedAnswer}`);
    }
  }, [questions, currentPage, selectedAnswer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleAnswerChange = (event) => {
    if (!isTestSubmitted) {
      setSelectedAnswer(event.target.value);
    }
  };

  const saveAnswer = async () => {
    if (isTestSubmitted) return; // Prevent saving answers if test is submitted

    const token = sessionStorage.getItem('token');
    const questionId = questions[0]?.questionId;

    if (!token || !questionId) {
      console.error('Cannot save answer: Missing token or question ID.');
      return;
    }

    try {
      await ExamServices.saveAnswer(questionId, testId, selectedAnswer, token);
      // Notify user of success, if necessary
    } catch (error) {
      console.error('Failed to save answer:', error.message);
      alert('An error occurred while saving your answer.'); // Notify the user of an error
    }
  };

  const handleNextPage = async () => {
    if (!selectedAnswer && !marked) {
      alert('Please select an option or mark the question before proceeding to the next question.');
      return;
    }
    await saveAnswer(); // Save the answer before changing the page
    if (pageDetails && !pageDetails.lastPage) {
      setCurrentPage((prev) => prev + 1);
      setSelectedAnswer('');
      setMarked(false);
    }
  };

  const handlePrevPage = async () => {
    if (!selectedAnswer && !marked) {
      alert('Please select an option or mark the question before proceeding to the previous question.');
      return;
    }
    await saveAnswer(); // Save the answer before changing the page
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleMarkChange = (event) => {
    if (!isTestSubmitted) {
      setMarked(event.target.checked);
    }
  };

 

  const handleSubmitTest = async () => {
    // Logic for submitting the test can be added here

    setIsTestSubmitted(true); // Mark the test as submitted
    await saveAnswer(); // Save the last answer (if any)
    alert('Test submitted successfully!');
    // Optionally, redirect user to a results page or dashboard
  };

 
  return (
    <div className="tab-container">
      <TabsComponent activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Scrollable container */}
      <Box
        sx={{
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          maxWidth: '6000px',
          margin: 'auto',
          marginTop: '20px',
          height: '90vh', // Set height to make it scrollable
          overflowY: 'auto', // Add vertical scrollbar
        }}
      >
        {loading && <Typography>Loading questions...</Typography>}
        {error && <Typography color="error">{error}</Typography>}

        {!loading && !error && questions.length > 0 && (
          <>
            <Box mb={2}>
              <Grid container justifyContent="left" alignItems="left">
                <Typography variant="h6">{testName}</Typography>
               
                <Grid container justifyContent="center" alignItems="left">
                <Typography variant="h6" sx={{ mx: 2, marginLeft: '8px' }}>
                 Time Remaining: {formatTime(timeRemaining)}
                </Typography>
                <Typography variant="h6" sx={{ mx: 2 }}>
                 Date: {formattedDate} 
                </Typography>
                <Typography variant="h6" sx={{ mx: 2 }}>
                 currentime: {formattedTime}
                </Typography>
                </Grid>
                </Grid>
                             
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                Question {pageDetails?.pageNumber + 1} of {pageDetails?.totalPages}
                <FormControlLabel
                  control={<Checkbox checked={marked} onChange={handleMarkChange} />}
                  label="Mark"
                  sx={{ marginLeft: 2 }}
                  disabled={isTestSubmitted} // Disable the checkbox when the test is submitted
                />
              </Typography>
            </Box>

            <Box sx={{ border: '1px solid black', borderRadius: 0, padding: '16px', marginBottom: '0' }}>
              <Typography variant="h5" align="left">{questions[0]?.question}</Typography>
            </Box>

            <Box mb={0} display="flex" justifyContent="left" alignItems="center">
              <Typography variant="h6" color="black" sx={{ fontSize: '0.875rem' }}>
                Select 1 option(s):
              </Typography>
            </Box>

            <RadioGroup value={selectedAnswer} onChange={handleAnswerChange} sx={{ mt: 3 }} disabled={isTestSubmitted}>
              <FormControlLabel value="option1" control={<Radio />} label={questions[0]?.option1} />
              <FormControlLabel value="option2" control={<Radio />} label={questions[0]?.option2} />
              <FormControlLabel value="option3" control={<Radio />} label={questions[0]?.option3} />
              <FormControlLabel value="option4" control={<Radio />} label={questions[0]?.option4} />
            </RadioGroup>

            <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center">
                <Button
                  variant="outlined"
                  sx={{
                    padding: '10px',
                    backgroundColor: '#e0e0e0',
                    color: 'blue',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    borderBottom: '1px solid gray',
                    fontFamily: "'Arial Unicode MS', Arial, sans-serif",
                    border: 'solid 1px gray',
                    marginRight: 2,
                    borderRadius: 1,
                  }}
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                >
                  Previous
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    padding: '10px',
                    backgroundColor: '#e0e0e0',
                    color: 'blue',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    borderBottom: '1px solid gray',
                    fontFamily: "'Arial Unicode MS', Arial, sans-serif",
                    border: 'solid 1px gray',
                    marginLeft: 2,
                    borderRadius: 1,
                  }}
                  onClick={handleNextPage}
                  disabled={pageDetails?.lastPage}
                >
                  Next
                </Button>
              </Box>

              <Box display="flex" alignItems="center">
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    padding: '10px',
                    backgroundColor: '#1976d2',
                    fontWeight: 'bold',
                    borderRadius: 1,
                  }}
                  onClick={handleSubmitTest}
                >
                  Submit Test
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </div>
  );
};

export default TestScreen;
