import React, { useState, useEffect } from "react";


const Navbar = ({
  designations,
  onSearch,
  onFilter,
  onSort,
  currentSearch,
  sortOrder,
  onOrderToggle
}) => {
  const [searchText, setSearchText] = useState(currentSearch || "");
  useEffect(() => {
    setSearchText(currentSearch);
  }, [currentSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchText);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchText]); 

  return (
    <nav className="w-full bg-white shadow-md p-4 flex flex-wrap items-center justify-between gap-3">
      {/* Search */}
      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Search employees..."
        className="border p-2 rounded w-full md:w-1/3"
      />

      {/* Filter */}
      <select
        defaultValue=""
        onChange={(e) => onFilter(e.target.value)}
        className="border p-2 rounded w-full md:w-1/4"
      >
        <option value="">All Designations</option>
        {designations?.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      {/* Sort */}
      <select
        defaultValue=""
        onChange={(e) => onSort(e.target.value)}
        className="border p-2 rounded w-full md:w-1/4"
      >
        <option value="createdAt">Sort By</option>
        <option value="name">Name (A–Z)</option>
        <option value="salary">Salary (Low → High)</option>
        <option value="createdAt">Newest First</option>

      </select>
        <button onClick={onOrderToggle} className="border p-2 rounded">
          {sortOrder === "asc" ? "↑" : "↓"}
        </button>
    </nav>
  );
};

export default Navbar;
