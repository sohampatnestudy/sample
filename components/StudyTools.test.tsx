// FIX: Import Jest globals to resolve TypeScript errors.
import { describe, test, expect, jest } from '@jest/globals';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StudyTools from './StudyTools';

// Mock hooks
jest.mock('../hooks/useTimer', () => ({
    useTimer: () => ({
        time: 0, isActive: false, laps: [],
        start: jest.fn(), pause: jest.fn(), reset: jest.fn(), addLap: jest.fn(),
    }),
    useCountdown: jest.fn().mockReturnValue({
        time: 1500, isActive: false,
        start: jest.fn(), pause: jest.fn(), reset: jest.fn(),
    }),
}));

describe('StudyTools component', () => {
    test('Pomodoro preset buttons change the mode and displayed message', () => {
        render(<StudyTools />);
        
        // Default mode is 'work'
        expect(screen.getByText("Time to focus! Let's get this done.")).toBeInTheDocument();

        const shortBreakButton = screen.getByRole('button', { name: /short break/i });
        fireEvent.click(shortBreakButton);

        // After clicking, the message for 'shortBreak' should appear.
        expect(screen.getByText("Great work! Time for a short break.")).toBeInTheDocument();
        
        const longBreakButton = screen.getByRole('button', { name: /long break/i });
        fireEvent.click(longBreakButton);

        // After clicking, the message for 'longBreak' should appear.
        expect(screen.getByText("You've earned it! Take a longer break.")).toBeInTheDocument();
    });
});