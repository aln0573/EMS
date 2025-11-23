import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Loader from "./common/Loader";

const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Dashboard = lazy(() => import("./pages/auth/Dashboard"));
const Employees = lazy(() => import("./pages/admin/Employees"));
const EditEmployee = lazy(() => import("./components/EditEmployee"));
const AddEmployee = lazy(() => import("./components/AddEmployee"));
const EmployeeView = lazy(() => import("./pages/auth/EmployeeView"));
const PageNotFound = lazy(() => import("./common/PageNotFound"));

import ProtectedRoute from "./common/ProtectedRoute";
import AdminRoute from "./common/AdminProtectedRoute";

const App = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employees/:id"
          element={
            <ProtectedRoute>
              <EmployeeView />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/employees"
          element={
            <AdminRoute>
              <Employees />
            </AdminRoute>
          }
        />

        <Route
          path="/employees/add"
          element={
            <AdminRoute>
              <AddEmployee />
            </AdminRoute>
          }
        />

        <Route
          path="/employees/:id/edit"
          element={
            <AdminRoute>
              <EditEmployee />
            </AdminRoute>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
};

export default App;
