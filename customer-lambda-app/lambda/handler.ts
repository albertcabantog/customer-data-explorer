import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Customer, PaginatedResponse } from './types';

// --- MOCK DATA SOURCE (The "Simplest" Source) ---
const MOCK_CUSTOMERS: Customer[] = Array.from({ length: 100 }).map((_, i) => ({
  id: `cust_id_${i + 1}`,
  fullName: `Customer${i + 1} User`,
  email: `user${i + 1}@superco.com`,
  registrationDate: new Date(Date.now() - i * 86400000).toDateString(),
}));

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log(">>>>> Enter here");
    // 1. Request Validation & Parsing
    const queryParams = event.queryStringParameters || {};
    const page = Math.max(1, parseInt(queryParams.page || '1', 10));
    const limit = Math.max(1, Math.min(50, parseInt(queryParams.limit || '10', 10))); // Max 50 items

    // 2. Data Retrieval Logic (In-Memory Pagination)
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedData = MOCK_CUSTOMERS.slice(startIndex, endIndex);

    const responseBody: PaginatedResponse<Customer> = {
      data: paginatedData,
      total: MOCK_CUSTOMERS.length,
      page,
      limit
    };

    // 3. Response
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // CORS support
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(responseBody),
    };

  } catch (error) {
    console.error('Error processing request:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};