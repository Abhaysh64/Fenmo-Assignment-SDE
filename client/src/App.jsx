import { useEffect, useState } from 'react';
import { getExpenses } from './api/expenseApi';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Filters from './components/Filters';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

const fetchExpenses = async () => {
  try {
    setLoading(true);
    setError('');

    const res = await getExpenses({
      category: category || undefined,
      sort: sort || undefined,
    });

    setExpenses(res.data);
  } catch (err) {
    setError('Failed to load expenses');
    console.log(err)
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchExpenses();
  }, [category, sort]);

  const handleAdd = (expense) => {
    setExpenses((prev) => [expense, ...prev]);
  };

  const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Expense Management</p>
          <h1>Expense Tracker</h1>
          <p className="subtext">
            Track expenses with reliable persistence and retry-safe submissions.
          </p>
        </div>

        <div className="stat-card">
          <span>Total Expenses</span>
          <strong>₹{total.toFixed(2)}</strong>
        </div>
      </header>

      <ExpenseForm onAdd={handleAdd} />

      <Filters
        category={category}
        setCategory={setCategory}
        sort={sort}
        setSort={setSort}
      />

      {loading && <div className="empty-state">Loading expenses...</div>}
{error && <div className="form-error">{error}</div>}
{!loading && !error && <ExpenseList expenses={expenses} />}

      <footer className="app-footer">
        Built for production-safe expense tracking
      </footer>
    </div>
  );
}

export default App;