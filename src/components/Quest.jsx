// CertificationScreen.jsx

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
import TabsComponent from './Tabs.jsx';
import '../styles/Quest.css'; // Import the CSS file
import { getTestsForUser } from '../services/APIservice.jsx';

const CertificationScreen = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTests = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        setLoading(false);
        setError('User is not authenticated.');
        return;
      }

      try {
        const testsData = await getTestsForUser(token);
        setTests(testsData);
      } catch (error) {
        console.error('Error fetching tests:', error.message);
        setError('Failed to load tests. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
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
