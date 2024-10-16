import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TabsComponent from './Tabs.jsx';
import '../styles/Quest.css'; // Import the CSS file

const CertificationScreen = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true); // Start loading as true
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    console.log('Token:', token);
    if (!token) {
      setLoading(false); // Stop loading if there's no token
      setError('User is not authenticated.');
      return;
    }

    axios
      .get(`http://localhost:8081/api/tests/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        setTests(response.data);
      })
      .catch((error) => {
        console.error(
          'Error fetching tests:',
          error.response ? error.response.data : error.message
        );
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
    <div className="tab-container">
      <TabsComponent activeTab={activeTab} setActiveTab={setActiveTab} />

      <Box className="certification-box">
        <Typography variant="h6" className="instructions">
          You have access to the following Question Banks and Tests. Please
          click on the test that you want to attempt.
        </Typography>

        <Box className="exam-header">
          <Typography variant="h6">{javaExamText}</Typography>
        </Box>

        {loading && <Typography className="loading">Loading tests...</Typography>}
        {error && <Typography className="error-message">{error}</Typography>}

        {!loading &&
          !error &&
          tests.map((test) => (
            <Box key={test.testId}>
              <Table className="test-table" onClick={() => handleStartExam(test)}>
                <TableBody>
                  <TableRow>
                    <TableCell style={{ display: 'none' }}>{test.testId}</TableCell>
                    <TableCell>
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
