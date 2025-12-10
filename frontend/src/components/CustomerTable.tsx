import React, { useEffect, useState } from 'react';
import { useCustomers } from '../context/CustomerContext';
import styles from './CustomerTable.module.css'; 

const PAGE_LIMIT = import.meta.env.VITE_PAGE_LIMIT;

export const CustomerTable: React.FC = () => {
  const { customers, total, loading, error, fetchCustomers } = useCustomers();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchCustomers(currentPage, PAGE_LIMIT);
  }, [currentPage, fetchCustomers]);

  const totalPages = Math.ceil(total / PAGE_LIMIT);

  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <h2>Customer Data Explorer</h2>
      
      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((cust) => (
                <tr key={cust.id}>
                  <td>{cust.id}</td>
                  <td>{cust.fullName}</td>
                  <td>{cust.email}</td>
                  <td>{cust.registrationDate}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.pagination}>
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};