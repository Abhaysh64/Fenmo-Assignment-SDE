const Filters = ({ category, setCategory, sort, setSort }) => {
  return (
    <div className="filters">
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">All Categories</option>
        <option value="Food">Food</option>
        <option value="Travel">Travel</option>
        <option value="Utilities">Utilities</option>
        <option value="Shopping">Shopping</option>
        <option value="Health">Health</option>
        <option value="Other">Other</option>
      </select>

      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="">Sort by date</option>
        <option value="date_desc">Newest First</option>
        <option value="date_asc">Oldest First</option>
        </select>
    </div>
  );
};

export default Filters;