const db = require('../db/database');
const crypto = require('crypto');
const { toPaise, toRupees } = require('../utils/money');

const uuidv4 = () => crypto.randomUUID();

const createExpense = (req, res) => {
  try {
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
      const existingExpense = db
        .prepare(`SELECT * FROM expenses WHERE idempotency_key = ?`)
        .get(idempotencyKey);

      if (existingExpense) {
        return res.status(200).json({
          ...existingExpense,
          amount: toRupees(existingExpense.amount),
        });
      }
    }

    const expense = {
      id: uuidv4(),
      amount: parsedAmount,
      category,
      description: description || '',
      date,
      created_at: new Date().toISOString(),
      idempotency_key: idempotencyKey || null,
    };

    db.prepare(`
      INSERT INTO expenses (
        id,
        amount,
        category,
        description,
        date,
        created_at,
        idempotency_key
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      expense.id,
      expense.amount,
      expense.category,
      expense.description,
      expense.date,
      expense.created_at,
      expense.idempotency_key
    );

    res.status(201).json({
      ...expense,
      amount: toRupees(expense.amount),
    });

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const getExpenses = (req, res) => {
  try {
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

    const rows = db.prepare(query).all(...params);

    const formattedRows = rows.map((expense) => ({
      ...expense,
      amount: toRupees(expense.amount),
    }));

    res.json(formattedRows);

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

module.exports = {
  createExpense,
  getExpenses,
};