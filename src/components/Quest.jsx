import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Tabs,
  Tab,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TabsComponent from './Tabs.jsx';

const CertificationScreen = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true); // Start loading as true
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    console.log("Token:", token);
    if (!token) {
      setLoading(false); // Stop loading if there's no token
      setError('User is not authenticated.');
      return;
    }

    axios.get(`http://localhost:8081/api/tests/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        setTests(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tests:", error.response ? error.response.data : error.message);
        setError('Failed to load tests. Please try again later.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleStartExam = (test) => {
    navigate(`/tests/${test.testId}`);
  };

  const javaExamText = 'EXPIRED - JA+ I V8 For OCA-JP-I SE8 (1Z0-808)';

  return (
    <div className="tab-container" style={{ textAlign: 'center' }}>
      <TabsComponent activeTab={activeTab} setActiveTab={setActiveTab} />     

      <Box
        sx={{
          border: 1,
          borderColor: 'gray',
          width: '99%',
          marginTop: '20px',
          padding: '10px',
          backgroundColor: '#f9f9f9',
        }}
      >
        <Typography variant="h6" align="left" fontSize="small">
          You have access to the following Question Banks and Tests. Please click on the test that you want to attempt.
        </Typography>

        <Box
          sx={{
            backgroundColor: '#DCE4F6',
            padding: '10px',
            borderRadius: '4px',
            marginTop: '10px',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              textAlign: 'left',
              fontWeight: 'bold',
              color: 'black',
              fontFamily: 'Arial Unicode MS, Arial, sans-serif',
              fontSize: 'medium',
            }}
          >
            {javaExamText}
          </Typography>
        </Box>

        {loading && <Typography>Loading tests...</Typography>}
        {error && <Typography color="error">{error}</Typography>}

        {!loading && !error && tests.map((test) => (
          <Box key={test.testId} sx={{ marginTop: '10px' }}>
            <Table sx={{ border: 1, borderColor: 'black', width: '100%', height: '80px' }}>
              <TableBody>
                <TableRow
                  key={test.testId}
                  onClick={() => handleStartExam(test)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#f0f0f0' },
                    transition: 'background-color 0.2s ease-in-out',
                  }}
                >
                  <TableCell sx={{ display: 'none' }}>{test.testId}</TableCell>
                  <TableCell
                    sx={{
                      padding: '10px',
                      backgroundColor: '#E0E0E0',
                      color: 'blue',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      borderBottom: '1px solid gray',
                      fontFamily: 'Arial Unicode MS, Arial, sans-serif',
                    }}
                  >
                    <Typography>
                      {`Click here to start the ${test.testName} - ${test.numberOfQuestions} Questions`}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        ))}
      </Box>
    </div>
  );
};

export default CertificationScreen;
