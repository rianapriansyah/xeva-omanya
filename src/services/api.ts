import axios from 'axios';
 
const API_BASE_URL = 'http://localhost:5101/api';
// const API_BASE_URL = 'https://srv664937.hstgr.cloud/api';

export const fetchProducts = (storeId:any) => axios.get(`${API_BASE_URL}/products/store/${storeId}`);
export const createProduct = (productsData: any) =>
  axios.post(`${API_BASE_URL}/products`, productsData);
export const updateProduct = (productId:any, productsData: any) =>
  axios.put(`${API_BASE_URL}/products/${productId}`, productsData);
export const deleteProduct = (productId:any) =>
  axios.delete(`${API_BASE_URL}/products/${productId}`);

export const fetchCategories = (storeId:any) => axios.get(`${API_BASE_URL}/category/store/${storeId}`);
export const createCategory = (categoryData: any) =>
  axios.post(`${API_BASE_URL}/category`, categoryData);
export const updateCategory = (categoryId:any, categoryData: any) =>
  axios.put(`${API_BASE_URL}/category/${categoryId}`, categoryData);
export const deleteCategory = (productId:any) =>
  axios.delete(`${API_BASE_URL}/category/${productId}`);

export const fetchPaymentMethods = () => axios.get(`${API_BASE_URL}/paymentmethods`);
export const createTransaction = (transactionData: any) =>
  axios.post(`${API_BASE_URL}/transactions`, transactionData);

export const updateTransaction = (transactionId: any, transactionData:any) =>
  axios.put(
    `${API_BASE_URL}/transactions/${transactionId}`,
    transactionData
  );
export const deleteTransaction = (transactionId:any) =>
  axios.delete(`${API_BASE_URL}/transactions/${transactionId}`); 

export const fetchTransaction = (storeId:any) => axios.get(`${API_BASE_URL}/transactions/store/${storeId}`);
export const fetchUnpaidTransaction = (storeId:any) => axios.get(`${API_BASE_URL}/transactions/store/${storeId}/unpaid`);
export const fetchTransactionByDate = (storeId:any, date:any) => axios.get(`${API_BASE_URL}/transactions/store/${storeId}/paid/by-date?date=${date}`);
export const fetchParkedTransactions = () => axios.get(`${API_BASE_URL}/transactions/unpaid`);


export const fetchDashboardData  = (storeId: number, filter: string, startDate?: string, endDate?: string) => axios.get(`${API_BASE_URL}/dashboard`, {params: { storeId, filter, startDate, endDate },});
export const fetchIncome  = (storeId: number, filter: string, startDate?: string, endDate?: string) => axios.get(`${API_BASE_URL}/dashboard/income-by-date`, {params: { storeId, filter, startDate, endDate },});
export const fetchProductsSoldData  = (storeId: number, filter: string, startDate?: string, endDate?: string) => axios.get(`${API_BASE_URL}/dashboard/products-sold`, {params: { storeId, filter, startDate, endDate },});
