const ExpenseList = ({ expenses }) => {
  if (!expenses.length) {
    return (
      <div className="empty-state">
        No expenses found. Add your first expense to begin tracking.
      </div>
    );
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Amount</th>
          <th>Category</th>
          <th>Description</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((exp) => (
          <tr key={exp.id}>
            <td>₹{exp.amount}</td>
            <td>
              <span className="category-badge">{exp.category}</span>
            </td>
            <td>{exp.description || '—'}</td>
            <td>{exp.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ExpenseList;