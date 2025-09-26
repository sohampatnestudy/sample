// FIX: Import Jest globals to resolve TypeScript errors.
import { describe, test, expect, jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock localStorage for tests
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('App component', () => {
  test('renders navigation items and does not crash', () => {
    render(<App />);
    
    // Check if key navigation items are rendered in the sidebar
    expect(screen.getByText('Subjects')).toBeInTheDocument();
    expect(screen.getByText('News Feed')).toBeInTheDocument();
    expect(screen.getByText('Planner')).toBeInTheDocument();
  });
});

/**
 * To run this test:
 * 1. Ensure you have Jest and React Testing Library installed:
 *    npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
 * 2. Configure Jest (e.g., in jest.config.js) to handle TSX and modules.
 */