// src/components/TabsComponent.test.jsx
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TabsComponent from '../components/Tabs.jsx';

describe('TabsComponent', () => {
  const setActiveTab = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the tabs correctly', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <TabsComponent activeTab={0} setActiveTab={setActiveTab} />
      </MemoryRouter>
    );

    expect(screen.getByText(/ExamNinja Test Studio/i)).toBeInTheDocument();
    ['Home', 'Certifications', 'Test', 'Review', 'Progress', 'Status'].forEach(tab => {
      expect(screen.getByText(tab)).toBeInTheDocument();
    });
  });
});
