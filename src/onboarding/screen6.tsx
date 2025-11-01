import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { backarrow } from "../assets/images";
import Back from "./shared/back";
// import { goggleicon } from "../assets/images";
import { hederalogo } from "../assets/images";

import { RiEyeOffFill, RiEyeFill, RiMailFill } from "react-icons/ri";

import { useAuthContext } from "../context/AuthContext";

export default function Screen6() {
  const navigate = useNavigate();

  const { setUser, setToken } = useAuthContext();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // UI state
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): string | null => {
    if (!email.trim()) {
      return "Please enter your email address";
    }

    if (!validateEmail(email)) {
      return "Please enter a valid email address";
    }

    if (!password) {
      return "Please enter your password";
    }

    return null;
  };

  // LOGIN FUNCTION

  const handleLogin = async () => {
    console.log("=== Starting Login ===");

    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      console.log("Validation failed:", validationError);
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const requestBody = {
        email: email.trim().toLowerCase(),
        password: password,
      };

      const response = await fetch("https://team-7-api.onrender.com/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let message =
          errorData.detail ||
          errorData.error ||
          "Login failed. Please check your credentials.";
        throw new Error(message);
      }

      const data = await response.json();
      console.log("✅ Login successful:", data);

      // ✅ Safely extract token (backend must return this key)
      const token =
        data.access ||
        data.token ||
        data.access_token ||
        data.authToken ||
        (data.user && data.user.token);

      if (!token) throw new Error("Token not returned from server");

      // ✅ Save token immediately (Context + LocalStorage)
      setToken(token);
      localStorage.setItem("authToken", token);

      // ✅ Always fetch the latest user profile after login
      const profileResponse = await fetch(
        "https://team-7-api.onrender.com/profile/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!profileResponse.ok) {
        throw new Error("Failed to fetch user profile after login.");
      }

      const profileData = await profileResponse.json();
      console.log("✅ Fresh profile fetched:", profileData);

      // ✅ Normalize data before saving (to match your dashboard UI)
      const normalizedUser = {
        username: profileData.username || profileData.user?.username || "",
        email: profileData.email || profileData.user?.email || "",
        first_name:
          profileData.first_name || profileData.user?.first_name || "",
        last_name: profileData.last_name || profileData.user?.last_name || "",
        wallet_id: profileData.wallet_id || "",
        ...profileData,
      };

      // ✅ Save properly
      setUser(normalizedUser);
      localStorage.setItem("user", JSON.stringify(normalizedUser));

      setSuccess("Login successful! Redirecting...");

      // ✅ Redirect cleanly after short delay
      setTimeout(() => {
        navigate("/dashboard");
        setEmail("");
        setPassword("");
      }, 800);
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  /* const handleGoogleSignIn = () => {
    console.log("Google sign-in clicked");
    setError("Google sign-in is not yet implemented");
  };
 */
  const handleHederaSignIn = () => {
    console.log("Hedera sign-in clicked");
    setError("Hedera sign-in is not yet implemented");
  };

  const handleRegisterClick = () => {
    console.log("Register clicked");
    // Navigate to registration screen
    window.location.href = "/signup";
  };

  return (
    <div className="h-screen bg-linear-to-br from-emerald-50 to-teal-50 w-full px-4 py-12 flex flex-col justify-between">
      <div>
        <Back
          image={backarrow}
          title="Welcome Back"
          text="Glad to have you back! Please enter your email and password to continue"
        />
      </div>

      <div className="w-full mb-4">
        <form
          className="w-full flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          {/* Email Input */}
          <div className="relative w-full">
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="Email"
              className="w-full p-4 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={isLoading}
            />
            <span className="absolute text-pri right-4 top-1/2 -translate-y-1/2">
              <RiMailFill size={25} />
            </span>
          </div>

          {/* Password Input */}
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Password"
              className="w-full p-4 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={isLoading}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleLogin();
                }
              }}
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 text-pri -translate-y-1/2"
            >
              {showPassword ? (
                <RiEyeOffFill className="w-5 h-5 cursor-pointer" />
              ) : (
                <RiEyeFill className="w-5 h-5 cursor-pointer" />
              )}
            </span>
          </div>

          {/* Forgot Password Link */}
          <div className="w-full text-right">
            <span className="text-sm text-blue-500 cursor-pointer hover:underline">
              Forgot Password?
            </span>
          </div>

          {/* Success Message */}
          {success && (
            <div className="w-full p-3 bg-green-50 border border-green-300 rounded-lg">
              <p className="text-green-600 text-sm font-medium">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="w-full p-3 bg-red-50 border border-red-300 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </form>
      </div>

      {/* Buttons */}
      <div className="">
        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="bg-[#00C317] mb-2 text-xl w-full p-4 font-semibold text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        {/* Hedera Button */}
        <button
          onClick={handleHederaSignIn}
          disabled={isLoading}
          className="bg-white mb-2 flex items-center justify-center gap-4 text-xl w-full p-4 font-semibold text-black rounded-full border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <span className="w-6 h-6">
            <img src={hederalogo} alt="Hedera logo" />
          </span>
          Continue with Hedera
        </button>

        {/* Google Button */}
        {/* <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="bg-white mb-2 flex items-center justify-center gap-4 text-xl w-full p-4 font-semibold text-black rounded-full border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <span>
            <img src={goggleicon} alt="Google logo" />
          </span>
          Continue with Google
        </button> */}
      </div>

      {/* Register Link */}
      <div>
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <span
            onClick={handleRegisterClick}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
