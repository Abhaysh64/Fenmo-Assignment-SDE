const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const expenseRoutes = require('./routes/expenses');


const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://fenmo-assignment-sde.vercel.app/'
  ]
}));app.use(express.json());
app.use(morgan('dev'));

app.use('/expenses', expenseRoutes);

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    error: 'Internal server error',
  });
});


app.get('/', (req, res) => {
  res.send('Expense Tracker API running');
});


app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'expense-tracker-api',
  });
});

module.exports = app;