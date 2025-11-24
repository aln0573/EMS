import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  loadEmployees,
  loadDesignations,
  setSearch,
  setDesignation,
  setSort,
  setPage,
  setSortOrder,
} from "../../features/admin/adminSlice";
import { logoutUser } from "../../features/auth/authSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import EmployeeTable from "../../components/EmployeeTable";
import toast from "react-hot-toast";
import axiosIntance from "../../app/axiosInstance";

const Employees = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isInitialized, setIsInitialized] = useState(false);

  const {
    employees = [],
    designations = [],
    search,
    designation,
    sortBy,
    sortOrder,
    page,
    totalPages,
  } = useSelector((state) => state.admin);

  useEffect(() => {
    const pageFromUrl = Number(searchParams.get("page")) || 1;

    const searchFromUrl = searchParams.get("search") || "";
    const designationFromUrl = searchParams.get("designation") || "";
    const sortByFromUrl = searchParams.get("sortBy") || "createdAt";
    const sortOrderFromUrl = searchParams.get("sortOrder") || "desc";

    dispatch(setPage(pageFromUrl));
    dispatch(setSearch(searchFromUrl));
    dispatch(setDesignation(designationFromUrl));
    dispatch(setSort(sortByFromUrl));

    setIsInitialized(true);
  }, []);

  useEffect(() => {
    dispatch(loadDesignations());
  }, [dispatch]);

  useEffect(() => {
    if (!isInitialized) return;

    dispatch(
      loadEmployees({
        page,
        search,
        designation,
        sortBy,
        sortOrder,
      })
    );
  }, [page, search, designation, sortBy, sortOrder, dispatch, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;

    const params = new URLSearchParams();
    params.set("page", page.toString());
    if (search) params.set("search", search);
    if (designation) params.set("designation", designation);
    params.set("sortBy", sortBy);
    params.set("sortOrder", sortOrder);

    setSearchParams(params, { replace: true });
  }, [page, search, designation, sortBy, sortOrder, isInitialized]);

  const handleSearch = (value) => {
    dispatch(setSearch(value));
    dispatch(setPage(1));
  };

  const handleFilter = (value) => {
    dispatch(setDesignation(value));
    dispatch(setPage(1));
  };

  const handleSort = (value) => {
    dispatch(setSort(value));
    dispatch(setPage(1));
  };

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;

    try {
      await axiosIntance.delete(`/employees/${id}`);
      toast.success("Employee deleted");
      dispatch(loadEmployees({ page, search, designation, sortBy, sortOrder }));
    } catch {
      toast.error("Failed to delete employee");
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => navigate("/"));
  };

  const handleSortOrderToggle = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    dispatch(setSortOrder(newOrder));
    dispatch(setPage(1));
  };

  return (
    <div className="p-6">
      <Navbar
        designations={designations}
        onSearch={handleSearch}
        onFilter={handleFilter}
        onOrderToggle={handleSortOrderToggle}
        onSort={handleSort}
        currentSearch={search}
        sortOrder={sortOrder}
      />

      <div className="flex justify-between my-4">
        <button
          onClick={() => navigate("/employees/add")}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Add Employee
        </button>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <EmployeeTable employees={employees} onDelete={handleDelete} />

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
    </div>
  );
};

export default Employees;
