"use client";
import React, { useState } from "react";
import axios from "axios";
import { Sun, Moon, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5500/api/v1";

export default function AuthPage() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSignIn, setIsSignIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({ userName: "", email: "", password: "", role: "user" });
  const [errorMessage, setErrorMessage] = useState("");
  const [errorFields, setErrorFields] = useState({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage("");
    setErrorFields({});
    const endpoint = isSignIn ? "/user/signin" : "/user/signup";

    try {
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, userData);
      console.log(`${isSignIn ? "Sign In" : "Sign Up"} Success:`, response.data);

      if (isSignIn) {
        // Fetch role after successful login
        const roleResponse = await axios.get(`${API_BASE_URL}/user/get-role`, {
          headers: { Authorization: `Bearer ${response.data.token}` },
        });

        const { role } = roleResponse.data;
        router.push(role === "admin" ? "/adminpanel" : "/marketplace");
      } else {
        router.push("/marketplace");
      }
    } catch (error) {
      if (error.response?.data) {
        const { message, fields } = error.response.data;
        setErrorMessage(message || "An error occurred. Please try again.");
        setErrorFields(fields || {});
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    }
  };

  const handleGoogleOAuth = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/user/google-Oauth`);
      window.location.href = response.data.url || "/";
    } catch {
      setErrorMessage("Error with Google OAuth. Please try again.");
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? "bg-black" : "bg-gray-100"}`}>
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`absolute top-6 right-6 p-2 rounded-full transition-all ${
          isDarkMode ? "bg-purple-900 text-purple-200" : "bg-white text-purple-800 shadow-md"
        }`}
      >
        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-800">
              Welcome to the Marketplace
            </h1>
            <p className={`${isDarkMode ? "text-purple-200" : "text-purple-800"}`}>Buy exclusive stuff</p>
          </div>

          <div
            className={`relative p-8 rounded-2xl transition-all duration-300 ${
              isDarkMode ? "bg-purple-900/50 border-purple-500/20" : "bg-white/80 border-purple-100"
            }`}
          >
            {/* Form */}
            <form className="space-y-6" onSubmit={handleAuth}>
              {!isSignIn && (
                <>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-purple-200" : "text-purple-800"}`}>
                      Username
                    </label>
                    <input
                      name="userName"
                      value={userData.userName}
                      onChange={handleInputChange}
                      placeholder="Enter your username"
                      className={`w-full px-4 py-2 rounded-lg ${
                        isDarkMode ? "bg-purple-800 text-purple-100" : "bg-purple-50 text-purple-900"
                      }`}
                    />
                    {errorFields.userName && <p className="text-red-500 text-sm">{errorFields.userName}</p>}
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-purple-200" : "text-purple-800"}`}>
                      Role
                    </label>
                    <select
                      name="role"
                      value={userData.role}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg ${
                        isDarkMode ? "bg-purple-800 text-purple-100" : "bg-purple-50 text-purple-900"
                      }`}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </>
              )}

              {/* Email */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-purple-200" : "text-purple-800"}`}>
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className={`w-full px-4 py-2 rounded-lg ${
                    isDarkMode ? "bg-purple-800 text-purple-100" : "bg-purple-50 text-purple-900"
                  }`}
                />
                {errorFields.email && <p className="text-red-500 text-sm">{errorFields.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-purple-200" : "text-purple-800"}`}>
                  Password
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={userData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className={`w-full px-4 py-2 rounded-lg ${
                      isDarkMode ? "bg-purple-800 text-purple-100" : "bg-purple-50 text-purple-900"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errorFields.password && <p className="text-red-500 text-sm">{errorFields.password}</p>}
              </div>

              {/* Submit Button */}
              <button className="w-full px-4 py-2 mt-6 text-white font-semibold rounded-lg bg-purple-600 hover:bg-purple-700">
                {isSignIn ? "Sign In" : "Sign Up"}
              </button>
            </form>

            {/* Google OAuth */}
            <div className="mt-6 text-center">
              <button
                onClick={handleGoogleOAuth}
                className="w-full px-4 py-2 font-semibold rounded-lg bg-white text-purple-800 hover:bg-purple-50"
              >
                Sign in with Google
              </button>
            </div>

            {/* Toggle Auth Mode */}
            <p className={`mt-4 text-sm text-center ${isDarkMode ? "text-purple-200" : "text-purple-800"}`}>
              {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
              <button onClick={() => setIsSignIn(!isSignIn)} className="text-purple-400 hover:underline">
                {isSignIn ? "Sign Up" : "Sign In"}
              </button>
            </p>

            {/* Error Message */}
            {errorMessage && <p className="mt-4 text-center text-red-500">{errorMessage}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
