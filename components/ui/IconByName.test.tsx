// FIX: Import Jest globals to resolve TypeScript errors.
import { describe, test, expect, jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import IconByName from './IconByName';

jest.mock('lucide-react', () => {
    const original = jest.requireActual('lucide-react');
    return {
        ...original,
        // Mock a specific icon for testing
        TestIcon: (props: any) => <svg data-testid="test-icon" {...props} />,
        // Use Clock as the default fallback icon for testing
        Clock: (props: any) => <svg data-testid="fallback-icon" {...props} />,
    };
});

describe('IconByName utility', () => {
    test('renders the correct icon when name is valid', () => {
        render(<IconByName name="TestIcon" />);
        expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    test('renders the fallback icon when name is not found', () => {
        render(<IconByName name="NonExistentIcon" />);
        expect(screen.getByTestId('fallback-icon')).toBeInTheDocument();
    });
});