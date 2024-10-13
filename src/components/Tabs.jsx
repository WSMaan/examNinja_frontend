// src/components/TabsComponent.jsx

import React from 'react';
import { Tabs, Tab, Typography, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const TabsComponent = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Set active tab based on the current location
  React.useEffect(() => {
    if (location.pathname === '/Quest') {
      setActiveTab(1);
    } else if (location.pathname === '/') {
      setActiveTab(0);
    }
  }, [location.pathname, setActiveTab]);

  // Tab change handler for navigation
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (newValue === 0) {
      navigate('/');
    } else if (newValue === 1) {
      navigate('/Quest');
    }
  };

  return (
    <Box>
      <Typography
        className="tab-title"
        sx={{
          padding: '5px',
          fontWeight: 'bold',
          color: '#cc3300',
          textShadow: '0px 2px 3px #ff9999',
          fontFamily: 'Verdana',
          textAlign: 'center',
        }}
      >
        ExamNinja Test Studio
      </Typography>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="Navigation Tabs"
        textColor="inherit"
        indicatorColor="primary"
        sx={{ borderBottom: '1px solid #ccc' }}
      >
        {['Home', 'Certifications', 'Test', 'Review', 'Progress', 'Status'].map((tabLabel, index) => (
          <Tab
            key={index}
            label={tabLabel}
            sx={{
              padding: '10px',
              cursor: 'pointer',
              borderTop: '1px solid black',
              borderLeft: '1px solid black',
              borderRight: '1px solid black',
              marginRight: '2px',
              color: 'white',
              fontSize: 'medium',
              fontFamily: 'Verdana',
              fontWeight: 'normal',
              textTransform: 'none',
              backgroundColor: '#f3140e',
              '&:hover': {
                backgroundColor: '#f3140e',
              },
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default TabsComponent;
