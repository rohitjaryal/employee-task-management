import { Route, Routes } from "react-router-dom";
import React from "react";

const EmployeeLogin = React.lazy(
  () => import("../views/Authentication/EmployeeLogin"),
);

const VerifyEmployee = React.lazy(
  () => import("../views/Authentication/VerifyEmployee"),
);
const Comments = React.lazy(() => import("@/views/Comments"));
const ManageEmployee = React.lazy(() => import("../views/ManageEmployee"));
const ManageTasks = React.lazy(() => import("../views/ManageTasks"));
const NotFound = React.lazy(() => import("@/views/NotFound"));
const Chat = React.lazy(() => import("@/views/Chat"));

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<EmployeeLogin />} />
      <Route path="/login" element={<EmployeeLogin />} />
      <Route path="/verify-employee" element={<VerifyEmployee />} />
      <Route path="/comments" element={<Comments />} />
      <Route path="/manage-employee" element={<ManageEmployee />} />
      <Route path="/manage-tasks" element={<ManageTasks />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
