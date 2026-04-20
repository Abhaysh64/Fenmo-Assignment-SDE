import { useState } from 'react';
import { createExpense } from '../api/expenseApi';

const categories = [
  'Food',
  'Travel',
  'Utilities',
  'Shopping',
  'Health',
  'Other',
];

const ExpenseForm = ({ onAdd }) => {
  const [form, setForm] = useState({
    amount: '',
    category: 'Food',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.amount || Number(form.amount) <= 0) {
      setError('Enter a valid amount');
      return;
    }

    setError('');

    try {
      setLoading(true);

      const res = await createExpense(form);
      onAdd(res.data);

      setForm({
        amount: '',
        category: 'Food',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      console.error(err);
      setError('Failed to save expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        step="0.01"
        placeholder="Amount"
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: e.target.value })}
      />

      <select
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <input
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <input
        type="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Add Expense'}
      </button>

      {error && <div className="form-error">{error}</div>}
    </form>
  );
};

export default ExpenseForm;