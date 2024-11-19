// src/components/TabsComponent.jsx

import React from 'react';
import { Tabs, Tab, Typography, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const TabsComponent = ({ activeTab, setActiveTab, isTestSubmitted }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Define each tab separately
  const tabs = [
    { label: 'Home', path: '/', unclickable: false },
    { label: 'Certifications', path: '/Quest', unclickable: !isTestSubmitted },
    { label: 'Test', path: '/tests/:testId', unclickable: false }, // Adjust dynamically based on test status
    { label: 'Review', path: '/Review', unclickable: false },
    { label: 'Progress', path: '/Progress', unclickable: false },
    { label: 'Status', path: '/Status', unclickable: false }
  ];

  // Update the active tab based on the current location (URL)
  React.useEffect(() => {
    const currentTabIndex = tabs.findIndex(tab => tab.path === location.pathname);
    if (currentTabIndex !== -1) {
      setActiveTab(currentTabIndex);
    }
  }, [location.pathname, setActiveTab, tabs]);

  const handleTabChange = (event, newValue) => {
    if (tabs[newValue].unclickable) return; // Prevent navigation if tab is "unclickable"
    setActiveTab(newValue);
    navigate(tabs[newValue].path); // Navigate to the appropriate path
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
        {/* Render each tab individually with specific conditions */}
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            label={tab.label}
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
              // If the tab is unclickable, apply pointer-events: none
              pointerEvents: tab.unclickable ? 'none' : 'auto', // Disables interaction but keeps style
              opacity: tab.unclickable ? 0.5 : 1, // Optional: Reduce opacity for unclickable tabs
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default TabsComponent;
