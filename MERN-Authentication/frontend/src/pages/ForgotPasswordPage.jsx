import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader, Mail } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import Input from "../components/Input";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { isLoading, forgotPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword(email);
    setIsSubmitted(true);
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
          Forgot Password
        </h2>
        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <p className="text-slate-300 mb-6 text-center">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
            <Input
              icon={Mail}
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold rounded-lg shadow-lg hover:from-indigo-600 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition duration-300"
              type="submit"
            >
              {isLoading ? (
                <Loader className="size-6 animate-spin mx-auto" />
              ) : (
                "Send Reset Link"
              )}
            </motion.button>{" "}
          </form>
        ) : (
          <div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Mail className="text-white h-8 w-8" />
            </motion.div>
            <p className="text-center text-slate-300 mb-6">
              If an Account exists for {email}, you will receive an email with a
              link to reset your password.
            </p>
          </div>
        )}
      </div>

      <div className="px-8 py-4 bg-slate-900/50 text-center text-slate-300 justify-center">
        <Link
          to={"/login"}
          className="text-sm text-indigo-400 hover:text-indigo-500 flex items-center justify-center transition duration-300"
        >
          <ArrowLeft className="size-4 mr-2" /> Back to login
        </Link>
      </div>
    </motion.div>
  );
};

export default ForgotPasswordPage;
