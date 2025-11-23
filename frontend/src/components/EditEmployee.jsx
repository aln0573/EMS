import React, { useEffect, useState } from "react";
import axiosIntance from "../app/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
    salary: "",
    profileImage: ""
  });

  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await axiosIntance.get(`/employees/${id}`);
        setEmployee(res.data);

        if (res.data.profileImage) {
          setPreview(`http://localhost:4001/uploads/employees/${res.data.profileImage}`);
        }
      } catch (error) {
        toast.error("Failed to load employee");
      }
    };
    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(employee).forEach(([key, value]) => {
      if (key !== "profileImage") formData.append(key, value);
    });

    if (file) {
      formData.append("profileImage", file);
    }

    try {
      await axiosIntance.put(`/employees/${id}`, formData);
      toast.success("Employee updated successfully");
      navigate("/employees");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Employee</h2>

      <form onSubmit={handleUpdate} className="space-y-3">
        <input name="name" value={employee.name} onChange={handleChange} className="border p-2 w-full" />
        <input name="email" value={employee.email} onChange={handleChange} className="border p-2 w-full" />
        <input name="phone" value={employee.phone} onChange={handleChange} className="border p-2 w-full" />

        <select name="designation" value={employee.designation} onChange={handleChange} className="border p-2 w-full">
          <option value="Manager">Manager</option>
          <option value="Developer">Developer</option>
          <option value="Designer">Designer</option>
          <option value="HR">HR</option>
          <option value="Accountant">Accountant</option>
          <option value="Other">Other</option>
        </select>

        <input name="salary" value={employee.salary} onChange={handleChange} className="border p-2 w-full" />

        {preview && <img src={preview} className="w-24 h-24 rounded-full object-cover" alt="Preview" />}

        <input type="file" onChange={handleFileChange} />

        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Update Employee
        </button>
      </form>
    </div>
  );
};

export default EditEmployee;
