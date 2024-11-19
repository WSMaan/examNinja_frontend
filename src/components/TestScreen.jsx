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
  const [selectedAnswer, setSelectedAnswer] = useState({ value: '', label: '' });
  const [marked, setMarked] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0); // Timer in seconds
  const [activeTab, setActiveTab] = useState(2); // State to manage active tab
  const [testName, setTestName] = useState(''); // New state for test name
  const [isTestSubmitted, setIsTestSubmitted] = useState(false); 
 
  const [answers, setAnswers] = useState({});

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
    
          // Check if an answer exists for this question in `answers`, otherwise set from API data
          const questionId = data.questions[0]?.questionId;
          const savedAnswer = answers[questionId];
          
          if (savedAnswer) {
            setSelectedAnswer(savedAnswer);
          } else if (data.selectedOption) {
            const selectedOptionKey = Object.keys(data.selectedOption)[0];
            const selectedOptionLabel = data.selectedOption[selectedOptionKey];
            const answer = { value: selectedOptionKey, label: selectedOptionLabel };
            setSelectedAnswer(answer);
            setAnswers(prev => ({ ...prev, [questionId]: answer }));
          } else {
            setSelectedAnswer({ value: '', label: '' });
          }
    
          setMarked(false);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
    
      fetchQuestions(currentPage);
    }, [testId, currentPage, answers]);

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
      console.log(`Loaded question ${questionId}: ${selectedAnswer.label}`);
    }
  }, [questions, currentPage, selectedAnswer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleAnswerChange = (event) => {
    if (isTestSubmitted) return;

    if (!isTestSubmitted) {
      const selectedValue = event.target.value;
      const selectedOptionLabel = event.target.labels[0].innerText;
     
      setSelectedAnswer({
        value: selectedValue,
        label: selectedOptionLabel
      });
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
     // alert('Answered Saved succesfully');
      // Notify user of success, if necessary
    } catch (error) {
      console.error('Failed to save answer:', error.message);
      alert('An error occurred while saving your answer.'); // Notify the user of an error
    }
    setAnswers(prev => ({ ...prev, [questionId]: selectedAnswer }));
  };

  const handleNextPage = async () => {
    if (isTestSubmitted) {
      if (pageDetails && !pageDetails.lastPage) {
        setCurrentPage((prev) => prev + 1);
           
      }
    
            
      return;
    }

    if (!selectedAnswer.value && !marked) {
      alert('Please select an option or mark the question before proceeding to the next question.');
      return;
    }
    await saveAnswer(); // Save the answer before changing the page
    if (pageDetails && !pageDetails.lastPage) {
      setCurrentPage((prev) => prev + 1);
      
    }
  };

  const handlePrevPage = async () => {
    if (isTestSubmitted) {
      if (currentPage > 0) {
        setCurrentPage((prev) => prev - 1);
      }
      return;
    
    }

   if (!selectedAnswer.value && !marked) {
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
       await saveAnswer(); 
       setIsTestSubmitted(true); 
       alert('Test submitted successfully!');


    
  };

   


 
  return (
    <div className="tab-container">
      <TabsComponent activeTab={activeTab} setActiveTab={setActiveTab} isTestSubmitted={isTestSubmitted} />

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

            <RadioGroup value={selectedAnswer.value} onChange={handleAnswerChange} sx={{ mt: 3, ...(isTestSubmitted && { pointerEvents: 'none', opacity: 0.6, }),  }}>
              <FormControlLabel value="option1" control={<Radio  />} label={questions[0]?.option1} />
              <FormControlLabel value="option2" control={<Radio  />} label={questions[0]?.option2} />
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

 