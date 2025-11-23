import Employees from "../models/Employees.js";
import path from "path";
import fs from "fs";

export const getEmployees = async (req, res) => {
  try {
    const {
      page,
      search = "",
      designation,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const pageNumber = Number(page) || 1;
    const limit = 5;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { designation: { $regex: search, $options: "i" } },
      ];
    }

    if (designation) {
      query.designation = designation;
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const skip = (pageNumber - 1) * limit;

    const employees = await Employees.find(query)
      .collation({ locale: "en", strength: 2 })
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);
    const totalEmployees = await Employees.countDocuments(query).collation({
      locale: "en",
      strength: 2,
    });

    res.status(200).json({
      total: totalEmployees,
      page: pageNumber,
      limit: limit,
      totalPages: Math.ceil(totalEmployees / limit),
      employees,
    });
  } catch (error) {
    console.error("Error fetching employees:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employees.findById(req.params.id);
    console.log(employee);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getDesignations = async (req, res) => {
  try {
    const designations = await Employees.distinct("designation");
    res.status(200).json({ designations });
  } catch (error) {
    console.error("Error fetching designations:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addEmployee = async (req, res) => {
  try {
    const { name, email, phone, designation, salary } = req.body;

    if (!name) return res.status(400).json({ message: "Name is required!" });
    if (!email) return res.status(400).json({ message: "Email is required!" });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingEmail = await Employees.findOne({ email });
    if (existingEmail) {
      return res
        .status(400)
        .json({ message: "Employee with this email already exists" });
    }

    if (salary && isNaN(salary)) {
      return res.status(400).json({ message: "Salary must be a number" });
    }

    const profileImage = req.file ? req.file.filename : null;

    const employee = new Employees({
      name,
      email,
      phone,
      designation,
      salary,
      profileImage,
    });
    await employee.save();

    res.status(201).json({ message: "Employee added successfully", employee });
  } catch (error) {
    console.error("Error adding employee:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const editEmployee = async (req, res) => {
  try {
    const id = req.params.id;

    const { name, email, phone, designation, salary } = req.body;

    const employee = await Employees.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (email && email !== employee.email) {
      const existingEmail = await Employees.findOne({
        email,
        _id: { $ne: employee._id },
      });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already use by another employee",
        });
      }
    }

    if (req.file) {
      if (employee.profileImage) {
        const oldPath = path.join("uploads/employees", employee.profileImage);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      employee.profileImage = req.file.filename;
    }

    employee.name = name ?? employee.name;
    employee.email = email ?? employee.email;
    employee.phone = phone ?? employee.phone;
    employee.designation = designation ?? employee.designation;
    employee.salary = salary ?? employee.salary;

    await employee.save();

    res
      .status(200)
      .json({ message: "Employee updated successfully", employee });
  } catch (error) {
    console.error("Error editing employee:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    const employee = await Employees.findById(id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (employee.profileImage) {
      const filePath = path.join("uploads/employees", employee.profileImage);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Employees.findByIdAndDelete(id);

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
