const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const expenseRoutes = require('./routes/expenses');


const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/expenses', expenseRoutes);

app.get('/', (req, res) => {
  res.send('Expense Tracker API running');
});

module.exports = app;