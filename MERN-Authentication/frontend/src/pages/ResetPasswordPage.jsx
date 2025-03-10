import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import Input from "../components/Input";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { resetPassword, error, isLoading, message } = useAuthStore();

  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await resetPassword({ password, token });
      toast.success("Password reset successfully");
      toast.success("Redirecting to login page");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error resetting password");
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent mb-6">
          Reset Password
        </h2>
        {error && (
          <p className="text-red-500 text-center mb-4 text-sm">{error}</p>
        )}
        {message && (
          <p className="text-green-500 text-center mb-4 text-sm">{message}</p>
        )}
        <form onSubmit={handleSubmit}>
          <Input
            icon={Lock}
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            icon={Lock}
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold rounded-lg shadow-lg hover:from-indigo-600 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition duration-300"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="size-6 animate-spin mx-auto" />
            ) : (
              "Set New Password"
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default ResetPasswordPage;
