import React, { useState } from "react";
import axiosIntance from "../app/axiosInstance";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AddEmployee = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
    salary: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const uploadData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      uploadData.append(key, value);
    });

    if (file) {
      uploadData.append("profileImage", file);
    }

    try {
      await axiosIntance.post("/employees", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      toast.success("Employee added successfully!");
      navigate("/employees");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add employee");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add New Employee</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <select
          name="designation"
          value={formData.designation}
          onChange={handleChange}
          className="border p-2 w-full"
        >
          <option value="">Select Designation</option>
          <option value="Manager">Manager</option>
          <option value="Developer">Developer</option>
          <option value="Designer">Designer</option>
          <option value="HR">HR</option>
          <option value="Accountant">Accountant</option>
          <option value="Other">Other</option>
        </select>

        <input
          name="salary"
          placeholder="Salary"
          value={formData.salary}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        {preview && (
          <img
            src={preview}
            className="w-24 h-24 rounded-full object-cover"
            alt="Preview"
          />
        )}

        <input type="file" accept="image/*" onChange={handleFileChange} />

        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add Employee
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;
