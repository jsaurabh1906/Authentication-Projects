import axios from "axios";
import { create } from "zustand";

const API_URL = import.meta.env.VITE_LOCAL_BACKEND_URL;

axios.defaults.withCredentials = true;
export const useAuthStore = create((set) => ({
  //initial states
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  //signup
  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    // TODO: Implement signup logic
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error Signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  //login
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error Logging in",
        isLoading: false,
      });
      throw error;
    }
  },

  //logout
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error Logging out",
        isLoading: false,
      });
    }
  },

  //Verify Email
  verifyEmail: async (verificationCode) => {
    console.log("Verifying Email: ", verificationCode);
    set({ isLoading: true, error: null });
    // TODO: Implement verifyEmail logic
    try {
      const response = await axios.post(`${API_URL}/verify-email`, {
        code: verificationCode,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response.data.message || "Error Verifying Email",
        isLoading: false,
      });
      throw error;
    }
  },

  //check auth
  checkAuth: async () => {
    // await new Promise((resolve) => setTimeout(resolve, 4000));
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({
        error: null,
        isCheckingAuth: false,
        isAuthenticated: false,
      });
    }
  },

  //forgot password
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      set({
        message: response.data.message,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || "Error Sending Reset Link",
      });

      throw error;
    }
  },

  //reset password
  resetPassword: async ({ password, token }) => {
    // console.log("password: ", password);
    // console.log("token: ", token);
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        password,
      });
      set({
        isLoading: false,
        message: response.data.message,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || "Error Resetting Password",
      });
    }
  },
}));
