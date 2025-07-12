import { Routes, Route } from "react-router-dom";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import Home from "../Pages/Home/Home";
import Chat from "../Pages/Chat/Chat";
import ProtectedRoute from "./ProtectedRoute";
import ForgotPassword from "../Pages/ForgotPassword/ForgotPassword";
import VerifyResetOtp from "../Components/VerifyResetOtp/VerifyResetOtp"
import ResetPassword from "../Pages/ResetPassword/ResetPassword";
import Layout from "../Components/Layout/Layout";


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verifyReset-Otp" element={<VerifyResetOtp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/chats"
        element={
          <ProtectedRoute>
            <Layout>
               <Chat/>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
