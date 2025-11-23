import react, { useEffect, useState } from "react";
import EmployeeTable from "../../components/EmployeeTable";
import { useDispatch, useSelector } from "react-redux";
import {
  getEmployeesList,
  setSearch,
  setDesignation,
  loadDesignations,
  setSort,
  setSortOrder,
  logoutUser,
} from "../../features/auth/authSlice";

import { useSearchParams,useNavigate } from "react-router-dom";
import { setPage } from "../../features/auth/authSlice";
import Navbar from "../../components/Navbar";

const EmployeesView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchFromUrl = searchParams.get("search") || "";

  const {
    employees = [],
    designations = [],
    search,
    designation,
    sortBy,
    sortOrder,
    page,
    totalPages,
  } = useSelector((state) => state.auth);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    if (search) params.set("search", search);
    if (designation) params.set("designation", designation);
    params.set("sortBy", sortBy);
    params.set("sortOrder", sortOrder);

    setSearchParams(params, { replace: true });
  }, [page, search, designation, isInitialized, sortBy, sortOrder]);

  useEffect(() => {
    dispatch(loadDesignations());
  }, [dispatch]);

  useEffect(() => {
    const pageFromUrl = Number(searchParams.get("page")) || 1;
    const designationFromUrl = searchParams.get("designation") || "";
    dispatch(setSearch(searchFromUrl));
    dispatch(getEmployeesList());
    dispatch(setPage(pageFromUrl));
    dispatch(setDesignation(designationFromUrl));
    setIsInitialized(true);
  }, []);

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
    setSearchParams({ page: newPage });
    dispatch(getEmployeesList());
  };

  const handleSearch = (value) => {
    dispatch(setSearch(value));
    dispatch(setPage(1));
    dispatch(getEmployeesList());
  };

  const handleFilter = (value) => {
    dispatch(setDesignation(value));
    dispatch(setPage(1));
    setSearchParams({ page: 1, designation: value, search });
    dispatch(getEmployeesList());
  };

  const handleSortChange = (value) => {
    dispatch(setSort(value));
    dispatch(setPage(1));
    setSearchParams({ page: 1, search, designation, sortBy: value, sortOrder });
    dispatch(getEmployeesList());
  };

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => navigate("/"));
  };

  const handleSortOrderToggle = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    dispatch(setSortOrder(newOrder));
    dispatch(setPage(1));
    setSearchParams({
      page: 1,
      search,
      designation,
      sortBy,
      sortOrder: newOrder,
    });
    dispatch(getEmployeesList());
  };

  return (
    <>
      <Navbar
        onSort={handleSortChange}
        onOrderToggle={handleSortOrderToggle}
        onSearch={handleSearch}
        currentSearch={search}
        onFilter={handleFilter}
        designations={designations}
        sortOrder={sortOrder}
      />
      <div className="p-6">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold mb-4">Employees</h2>
           <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
        >
          Logout
        </button>
        </div>

        <EmployeeTable employees={employees} readOnly />
      </div>

      <div className="flex justify-center mt-4 gap-4">
        <button
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="px-3 py-2 border rounded">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => handlePageChange(page + 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </>
  );
};

export default EmployeesView;
