import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosIntance from "../../app/axiosInstance";

const EmployeeDetails = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);

  const IMAGE_BASE_URL = "http://localhost:4001/uploads/employees/";

  const loadEmployee = async () => {
    try {
      const res = await axiosIntance.get(`auth/employees/${id}`);
      setEmployee(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching employee details:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployee();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 text-center text-lg">Loading employee details...</div>
    );
  }

  if (!employee) {
    return (
      <div className="p-6 text-center text-red-500 text-lg">
        Employee not found.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Employee Details</h2>

      <div className="bg-white shadow-md rounded-lg p-6 border">
        <div className="flex items-center mb-6">
          <div
            className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-3xl font-bold text-gray-700"
            onClick={() => setShowImageModal(true)}
          >
            <img
              src={`${IMAGE_BASE_URL}${employee.profileImage}`}
              alt=""
              className="w-20 h-20 object-cover rounded-full"
            />
          </div>
          <div className="ml-4">
            <h3 className="text-xl font-semibold">{employee.name}</h3>
            <p className="text-gray-600">{employee.designation}</p>
          </div>
        </div>

        {showImageModal && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowImageModal(false)}
          >
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <img
                src={`${IMAGE_BASE_URL}${employee.profileImage}`}
                alt="Large view"
                className="w-[350px] h-[350px] object-cover rounded shadow-xl md:w-[420px] md:h-[420px]"
              />

              <button
                className="absolute top-2 right-2 bg-white text-black rounded-full px-2 py-1 shadow"
                onClick={() => setShowImageModal(false)}
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <p>
            <strong>Email:</strong> {employee.email}
          </p>
          <p>
            <strong>Phone:</strong> {employee.phone || "N/A"}
          </p>
          <p>
            <strong>Designation:</strong> {employee.designation}
          </p>
          <p>
            <strong>Salary:</strong>{" "}
            {employee.salary ? `₹ ${employee.salary}` : "N/A"}
          </p>
          <p>
            <strong>Joined On:</strong>{" "}
            {new Date(employee.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <Link
          to="/dashboard"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Back to Employees List
        </Link>
      </div>
    </div>
  );
};

export default EmployeeDetails;
