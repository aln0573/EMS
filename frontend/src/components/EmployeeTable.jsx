import React from "react";
import { useNavigate } from "react-router-dom";
import fallbackImage from "../assets/fallback_profile.jpg";

const EmployeeTable = ({ employees, onDelete, readOnly = false }) => {
  const navigate = useNavigate();

  const IMAGE_BASE_URL = "http://localhost:4001/uploads/employees/";

  return (
    <table className="w-full border mt-4">
      <thead>
        <tr className="bg-gray-200">
          <th className="p-2 border">Profile</th>
          <th className="p-2 border">Name</th>
          <th className="p-2 border">Email</th>
          <th className="p-2 border">Phone</th>
          <th className="p-2 border">Designation</th>
          <th className="p-2 border">Salary</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>

      <tbody>
        {employees?.length === 0 ? (
          <tr>
            <td colSpan="7" className="p-4 text-center">
              No employees found
            </td>
          </tr>
        ) : (
          employees?.map((emp) => (
            <tr key={emp._id} className="hover:bg-gray-50">
              <td className="p-2 border text-center">
                {emp.profileImage ? (
                  <img
                    src={`${IMAGE_BASE_URL}${emp.profileImage}`}
                    alt="profile"
                    className="w-10 h-10 rounded-full mx-auto object-cover"
                    onError={(e) => (e.target.src = fallbackImage)}
                  />
                ) : (
                  <img
                    src={fallbackImage}
                    alt="fallback"
                    className="w-10 h-10 rounded-full mx-auto object-cover"
                  />
                )}
              </td>

              <td className="p-2 border">{emp.name}</td>
              <td className="p-2 border">{emp.email}</td>
              <td className="p-2 border">{emp.phone}</td>
              <td className="p-2 border">{emp.designation}</td>
              <td className="p-2 border">₹ {emp.salary || "-"}</td>

              <td className="border p-2">
                {readOnly && (
                  <button
                    onClick={() =>
                      navigate(`/employees/${emp._id}`)
                    }
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    View
                  </button>
                )}

                {!readOnly && (
                  <>
                    <button onClick={()=>navigate(`/employees/${emp._id}/edit`)} className="px-3 py-1 bg-yellow-500 text-white rounded mx-2">
                      Edit
                    </button>
                    <button onClick={()=>onDelete(emp._id)} className="px-3 py-1 bg-red-600 text-white rounded">
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default EmployeeTable;
