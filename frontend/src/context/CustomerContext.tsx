import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Customer, ApiResponse } from '../types/Customers';

interface CustomerContextType {
  customers: Customer[];
  total: number;
  loading: boolean;
  error: string | null;
  fetchCustomers: (page: number, limit: number) => Promise<void>;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(async (page: number, limit: number) => {
    setLoading(true);
    setError(null);
    try {
      // Replace with your actual API Gateway URL from CDK output
      const API_URL = import.meta.env.VITE_CUSTOMER_API_URL; 
      console.log("api: " + API_URL);
      const response = await fetch(`${API_URL}/customers?page=${page}&limit=${limit}`); 
      
      if (!response.ok) throw new Error('Failed to fetch data');
      const data: ApiResponse = await response.json();
      setCustomers(data.data);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <CustomerContext.Provider value={{ customers, total, loading, error, fetchCustomers }}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomers = () => {
  const context = useContext(CustomerContext);
  if (!context) throw new Error('useCustomers must be used within a CustomerProvider');
  return context;
};