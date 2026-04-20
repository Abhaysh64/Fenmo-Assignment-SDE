import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000',
});

export const createExpense = async (data) => {
  return API.post('/expenses', data, {
    headers: {
      'Idempotency-Key': crypto.randomUUID(),
    },
  });
};

export const getExpenses = async (params) => {
  return API.get('/expenses', { params });
};