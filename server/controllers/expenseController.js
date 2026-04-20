const db = require('../db/database');
const { v4: uuidv4 } = require('uuid');
const { toPaise, toRupees } = require('../utils/money');

const createExpense = (req, res) => {
  const { amount, category, description, date } = req.body;
  const idempotencyKey = req.headers['idempotency-key'];

  if (!amount || !category || !date) {
    return res.status(400).json({
      error: 'amount, category and date are required',
    });
  }

  const parsedAmount = toPaise(amount);

  if (parsedAmount <= 0) {
    return res.status(400).json({
      error: 'amount must be greater than zero',
    });
  }

  if (idempotencyKey) {
    db.get(
      `SELECT * FROM expenses WHERE idempotency_key = ?`,
      [idempotencyKey],
      (err, existingExpense) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        if (existingExpense) {
          return res.status(200).json({
            ...existingExpense,
            amount: toRupees(existingExpense.amount),
          });
        }

        insertExpense();
      }
    );
  } else {
    insertExpense();
  }

  function insertExpense() {
    const expense = {
      id: uuidv4(),
      amount: parsedAmount,
      category,
      description: description || '',
      date,
      created_at: new Date().toISOString(),
      idempotency_key: idempotencyKey || null,
    };

    db.run(
      `
      INSERT INTO expenses (id, amount, category, description, date, created_at, idempotency_key)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        expense.id,
        expense.amount,
        expense.category,
        expense.description,
        expense.date,
        expense.created_at,
        expense.idempotency_key,
      ],
      function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        res.status(201).json({
          ...expense,
          amount: toRupees(expense.amount),
        });
      }
    );
  }
};

const getExpenses = (req, res) => {
  const { category, sort } = req.query;

  let query = `SELECT * FROM expenses`;
  const params = [];

  if (category) {
    query += ` WHERE category = ?`;
    params.push(category);
  }

 if (sort === 'date_desc') {
  query += ` ORDER BY date DESC`;
} else if (sort === 'date_asc') {
  query += ` ORDER BY date ASC`;
} else {
  query += ` ORDER BY created_at DESC`;
}

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const formattedRows = rows.map((expense) => ({
      ...expense,
      amount: toRupees(expense.amount),
    }));

    res.json(formattedRows);
  });
};

module.exports = {
  createExpense,
  getExpenses,
};