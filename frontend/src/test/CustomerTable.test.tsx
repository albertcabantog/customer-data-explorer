import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CustomerTable } from '../components/CustomerTable'; // Adjust path as needed
import { useCustomers } from '../context/CustomerContext';

// Mock the CustomerContext hook
vi.mock('../context/CustomerContext', () => ({
    useCustomers: vi.fn(),
}));

// Mock the environment variable for PAGE_LIMIT
const PAGE_LIMIT = 10;
vi.stubEnv('VITE_PAGE_LIMIT', String(PAGE_LIMIT));

// Define a type for our mock
type MockUseCustomers = ReturnType<typeof useCustomers>;

// Mock data
const mockCustomers = [
    { id: 1, fullName: 'Alice Johnson', email: 'alice@example.com', registrationDate: '2023-01-01' },
    { id: 2, fullName: 'Bob Smith', email: 'bob@example.com', registrationDate: '2023-01-05' },
    { id: 3, fullName: 'Charlie Brown', email: 'charlie@example.com', registrationDate: '2023-01-10' },
    { id: 4, fullName: 'Diana Prince', email: 'diana@example.com', registrationDate: '2023-01-15' },
    { id: 5, fullName: 'Clark Kent', email: 'clark@example.com', registrationDate: '2023-01-20' },
];

// Cast the mocked hook to a mock function
const mockUseCustomers = useCustomers as unknown as vi.Mock<[], MockUseCustomers>;

describe('CustomerTable', () => {
    const mockFetchCustomers = vi.fn();

    beforeEach(() => {
        // Reset all mock implementations before each test
        vi.clearAllMocks();
    });

    it('renders the header correctly', () => {
        // Setup for initial render with a base state
        mockUseCustomers.mockReturnValue({
            customers: [],
            total: 0,
            loading: false,
            error: null,
            fetchCustomers: mockFetchCustomers,
        });

        render(<CustomerTable />);
        const heading = screen.getByRole('heading', { name: /customer data explorer/i });
        expect(heading).toBeDefined();
    });

      it('calls fetchCustomers on initial render (useEffect)', () => {
        mockUseCustomers.mockReturnValue({
          customers: [],
          total: 0,
          loading: false,
          error: null,
          fetchCustomers: mockFetchCustomers,
        });

        render(<CustomerTable />);

        // Expect fetchCustomers to be called once with initial page (1) and limit
        expect(mockFetchCustomers).toHaveBeenCalledTimes(1);
        expect(mockFetchCustomers).toHaveBeenCalledWith(1, String(PAGE_LIMIT)); // Stubbing converting value to String
      });

      it('renders "Loading..." when loading is true', () => {
        mockUseCustomers.mockReturnValue({
          customers: [],
          total: 10,
          loading: true, // Key state for this test
          error: null,
          fetchCustomers: mockFetchCustomers,
        });

        render(<CustomerTable />);

        expect(screen.getByText('Loading...')).toBeDefined();
        expect(screen.queryByRole('table')).toBeNull();
      });

      it('renders the error message when an error is present', () => {
        const errorMessage = 'Failed to fetch data';
        mockUseCustomers.mockReturnValue({
          customers: [],
          total: 0,
          loading: false,
          error: errorMessage, // Key state for this test
          fetchCustomers: mockFetchCustomers,
        });

        render(<CustomerTable />);

        expect(screen.getByText(`Error: ${errorMessage}`)).toBeDefined();
        expect(screen.queryByRole('table')).toBeNull();
        expect(screen.queryByText('Loading...')).toBeNull();
      });

      it('renders customer data in the table', () => {
        mockUseCustomers.mockReturnValue({
          customers: mockCustomers, // Key state for this test
          total: 5,
          loading: false,
          error: null,
          fetchCustomers: mockFetchCustomers,
        });

        render(<CustomerTable />);

        // Check for table structure and data
        const table = screen.getByRole('table');
        expect(table).toBeDefined();

        // Check for one of the customer's names
        expect(screen.getByText('Alice Johnson')).toBeDefined();
        expect(screen.getByText('charlie@example.com')).toBeDefined();

        // Check for the correct number of rows (10 data rows + 1 header row)
        expect(screen.getAllByRole('row')).toHaveLength(mockCustomers.length + 1);
      });

      it('handles pagination correctly', async () => {
        // Total customers is 25. With PAGE_LIMIT=10, this means 3 pages.
        const totalCustomers = 25;
        const totalPages = Math.ceil(totalCustomers / PAGE_LIMIT);

        mockUseCustomers.mockReturnValue({
          customers: mockCustomers,
          total: totalCustomers, // Key state for this test
          loading: false,
          error: null,
          fetchCustomers: mockFetchCustomers,
        });

        render(<CustomerTable />);

        const prevButton = screen.getByRole('button', { name: /previous/i });
        const nextButton = screen.getByRole('button', { name: /next/i });

        // Initial state check (Page 1)
        expect(screen.getByText(`Page 1 of ${totalPages}`)).toBeDefined();

        // --- Go to Page 2 ---
        fireEvent.click(nextButton);

        // After state update, useEffect should trigger fetchCustomers(2, 10)
        await waitFor(() => {
            // The component's state (currentPage) updates immediately
            expect(screen.getByText(`Page 2 of ${totalPages}`)).toBeDefined();
        });

        // Check that fetchCustomers was called for the new page
        // (1 initial + 1 for next button click = 2)
        expect(mockFetchCustomers).toHaveBeenCalledTimes(2);
        expect(mockFetchCustomers).toHaveBeenCalledWith(2, String(PAGE_LIMIT));

        // --- Go to Page 3 ---
        fireEvent.click(nextButton);

        await waitFor(() => {
            expect(screen.getByText(`Page 3 of ${totalPages}`)).toBeDefined();
        });

        // Check fetchCustomers call for page 3
        expect(mockFetchCustomers).toHaveBeenCalledTimes(3);
        expect(mockFetchCustomers).toHaveBeenCalledWith(3, String(PAGE_LIMIT));

        // --- Go back to Page 2 ---
        fireEvent.click(prevButton);

        await waitFor(() => {
            expect(screen.getByText(`Page 2 of ${totalPages}`)).toBeDefined();
        });

        // Check fetchCustomers call for page 2 (4 total calls)
        expect(mockFetchCustomers).toHaveBeenCalledTimes(4);
        expect(mockFetchCustomers).toHaveBeenCalledWith(2, String(PAGE_LIMIT));
      });
});