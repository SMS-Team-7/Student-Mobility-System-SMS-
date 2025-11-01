// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// import { backarrow } from "../assets/images";
// import Back from "./shared/back";
// import { goggleicon } from "../assets/images";
// import { hederalogo } from "../assets/images";
// import { emailicon } from "../assets/images";
// import { usericon } from "../assets/images";
// import { passwordicon } from "../assets/images";


// export default function Screen5() {
//     const navigate = useNavigate();

//     // Form state
//     const [username, setUsername] = useState("");
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");
//     const [agreedToTerms, setAgreedToTerms] = useState(false);

//     // UI state
//     const [error, setError] = useState("");
//     const [isLoading, setIsLoading] = useState(false);

//     // Validation functions
//     const validateEmail = (email: string): boolean => {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         return emailRegex.test(email);
//     };

//     const validatePassword = (password: string): boolean => {
//         // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
//         return password.length >= 8;
//     };

//     const validateForm = (): string | null => {
//         // Check if all fields are filled
//         if (!username.trim()) {
//             return "Please enter a username";
//         }

//         if (username.length < 3) {
//             return "Username must be at least 3 characters long";
//         }

//         if (!email.trim()) {
//             return "Please enter your email address";
//         }

//         if (!validateEmail(email)) {
//             return "Please enter a valid email address";
//         }

//         if (!password) {
//             return "Please enter a password";
//         }

//         if (!validatePassword(password)) {
//             return "Password must be at least 8 characters long";
//         }

//         if (password !== confirmPassword) {
//             return "Passwords do not match";
//         }

//         if (!agreedToTerms) {
//             return "You must agree to the Terms of Service and Privacy Policy";
//         }

//         return null; // No errors
//     };

//     const handleRegister = async () => {
//         console.log("=== Starting Registration ===");

//         // Clear previous errors
//         setError("");

//         // Validate the form
//         const validationError = validateForm();
//         if (validationError) {
//             console.log("Validation failed:", validationError);
//             setError(validationError);
//             return;
//         }

//         console.log("Form validation passed");
//         console.log("Username:", username);
//         console.log("Email:", email);

//         setIsLoading(true);

//         try {
//             // STEP 1: Call the /register/ endpoint
//             console.log("Calling /register/ endpoint...");

//             const response = await fetch("https://team-7-api.onrender.com/register/", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     username: username.trim(),
//                     email: email.trim().toLowerCase(),
//                     password: password,
//                     role: "student", // You can make this dynamic if needed
//                 }),
//             });

//             console.log("Response status:", response.status);

//             // STEP 2: Check if registration was successful
//             if (!response.ok) {
//                 console.error("Registration failed with status:", response.status);

//                 let errorMessage = "Registration failed. Please try again.";

//                 try {
//                     const errorData = await response.json();
//                     console.error("Error response:", errorData);

//                     // Extract error message from response
//                     errorMessage = errorData.message || errorData.error || errorData.detail || errorMessage;

//                     // Handle specific error cases
//                     if (errorData.username) {
//                         errorMessage = "Username already taken. Please choose another.";
//                     } else if (errorData.email) {
//                         errorMessage = "Email already registered. Please login instead.";
//                     }
//                 } catch (parseError) {
//                     console.error("Could not parse error response");
//                 }

//                 // Provide specific messages based on status codes
//                 if (response.status === 400) {
//                     throw new Error(errorMessage || "Invalid registration data. Please check your information.");
//                 } else if (response.status === 409) {
//                     throw new Error("Account already exists. Please login instead.");
//                 } else if (response.status === 422) {
//                     throw new Error("Invalid data format. Please check your entries.");
//                 } else if (response.status >= 500) {
//                     throw new Error("Server error. Please try again later.");
//                 } else {
//                     throw new Error(errorMessage);
//                 }
//             }

//             // STEP 3: Parse the successful response
//             const data = await response.json();
//             console.log("Registration successful! Response:", data);

//             // STEP 4: Store user information
//             // The API returns the created user data
//             if (data.username) {
//                 localStorage.setItem("username", data.username);
//                 console.log("Stored username:", data.username);
//             }

//             if (data.email) {
//                 localStorage.setItem("userEmail", data.email);
//                 console.log("Stored email:", data.email);
//             }

//             if (data.role) {
//                 localStorage.setItem("userRole", data.role);
//                 console.log("Stored role:", data.role);
//             }

//             // Store the entire user object
//             localStorage.setItem("user", JSON.stringify(data));

//             // STEP 5: Navigate to the next screen
//             // You might want to go to a success screen, OTP setup, or login
//             console.log("Navigating to welcome screen...");

//             // Option 1: Go directly to welcome/dashboard
//             navigate("/welcome", {
//                 state: {
//                     message: "Registration successful! Welcome to Hedera.",
//                     username: data.username,
//                 }
//             });

//             // Option 2: Go to OTP setup if you want to add 2FA
//             // navigate("/auth", {
//             //     state: {
//             //         email: email,
//             //         justRegistered: true,
//             //     }
//             // });

//             // Option 3: Go to login screen
//             // navigate("/login", {
//             //     state: {
//             //         message: "Registration successful! Please login.",
//             //         email: email,
//             //     }
//             // });

//         } catch (err) {
//             console.error("Registration error:", err);

//             // Handle network errors
//             if (err instanceof TypeError && err.message.includes("fetch")) {
//                 setError("Network error. Please check your internet connection.");
//             } else {
//                 setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
//             }
//         } finally {
//             setIsLoading(false);
//             console.log("=== Registration Process Completed ===");
//         }
//     };

//     const handleGoogleSignIn = () => {
//         console.log("Google sign-in clicked");
//         // Implement Google OAuth integration here
//         setError("Google sign-in is not yet implemented");
//     };

//     const handleHederaSignIn = () => {
//         console.log("Hedera sign-in clicked");
//         // Implement Hedera wallet integration here
//         setError("Hedera sign-in is not yet implemented");
//     };

//     const handleLoginClick = () => {
//         console.log("Navigating to login screen");
//         navigate("/login");
//     };

//     return (
//         <div className="h-screen bg-gradient-to-br from-emerald-50 to-teal-50 w-full px-4 py-12 flex flex-col justify-between overflow-y-auto">
//             <div>
//                 <Back
//                     image={backarrow}
//                     title="Get Started"
//                     text="Please kindly enter the username of your choice, a valid email address and password to access your account"
//                 />
//             </div>

//             <div className="w-full mb-4">
//                 <form
//                     className="w-full flex flex-col gap-4"
//                     onSubmit={(e) => {
//                         e.preventDefault();
//                         handleRegister();
//                     }}
//                 >
//                     {/* Username Input */}
//                     <div className="relative w-full">
//                         <input
//                             type="text"
//                             name="username"
//                             id="username"
//                             value={username}
//                             onChange={(e) => {
//                                 setUsername(e.target.value);
//                                 setError(""); // Clear error when user types
//                             }}
//                             placeholder="Username"
//                             className="w-full p-4 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                             disabled={isLoading}
//                         />
//                         <span className="absolute right-4 top-1/2 -translate-y-1/2">
//                             <img src={usericon} alt="user icon" className="w-5 h-5" />
//                         </span>
//                     </div>

//                     {/* Email Input */}
//                     <div className="relative w-full">
//                         <input
//                             type="email"
//                             name="email"
//                             id="email"
//                             value={email}
//                             onChange={(e) => {
//                                 setEmail(e.target.value);
//                                 setError("");
//                             }}
//                             placeholder="Email"
//                             className="w-full p-4 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                             disabled={isLoading}
//                         />
//                         <span className="absolute right-4 top-1/2 -translate-y-1/2">
//                             <img src={emailicon} alt="email icon" className="w-5 h-5" />
//                         </span>
//                     </div>

//                     {/* Password Input */}
//                     <div className="relative w-full">
//                         <input
//                             type="password"
//                             name="password"
//                             id="password"
//                             value={password}
//                             onChange={(e) => {
//                                 setPassword(e.target.value);
//                                 setError("");
//                             }}
//                             placeholder="Password"
//                             className="w-full p-4 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                             disabled={isLoading}
//                         />
//                         <span className="absolute right-4 top-1/2 -translate-y-1/2">
//                             <img src={passwordicon} alt="password icon" className="w-5 h-5" />
//                         </span>
//                     </div>

//                     {/* Confirm Password Input */}
//                     <div className="relative w-full">
//                         <input
//                             type="password"
//                             name="confirmPassword"
//                             id="confirmPassword"
//                             value={confirmPassword}
//                             onChange={(e) => {
//                                 setConfirmPassword(e.target.value);
//                                 setError("");
//                             }}
//                             placeholder="Confirm Password"
//                             className="w-full p-4 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                             disabled={isLoading}
//                         />
//                         <span className="absolute right-4 top-1/2 -translate-y-1/2">
//                             <img src={passwordicon} alt="password icon" className="w-5 h-5" />
//                         </span>
//                     </div>

//                     {/* Error Message */}
//                     {error && (
//                         <div className="w-full p-3 bg-red-50 border border-red-300 rounded-lg">
//                             <p className="text-red-600 text-sm">{error}</p>
//                         </div>
//                     )}
//                 </form>
//             </div>

//             {/* Terms Checkbox */}
//             <div className="flex items-start mb-6 gap-2">
//                 <input
//                     type="checkbox"
//                     checked={agreedToTerms}
//                     onChange={(e) => {
//                         setAgreedToTerms(e.target.checked);
//                         setError("");
//                     }}
//                     className="w-4 h-4 mt-1 cursor-pointer accent-green-500"
//                     disabled={isLoading}
//                 />
//                 <p className="text-sm text-gray-600">
//                     I agree with Hedera's{" "}
//                     <span className="text-blue-500 cursor-pointer hover:underline">
//                         Terms of Service
//                     </span>{" "}
//                     and{" "}
//                     <span className="text-blue-500 cursor-pointer hover:underline">
//                         Privacy Policy
//                     </span>
//                 </p>
//             </div>

//             {/* Buttons */}
//             <div className="">
//                 {/* Confirm/Register Button */}
//                 <button
//                     onClick={handleRegister}
//                     disabled={isLoading}
//                     className="bg-[#00C317] mb-2 text-xl w-full p-4 font-semibold text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
//                 >
//                     {isLoading ? "Creating Account..." : "Confirm"}
//                 </button>

//                 {/* Hedera Button */}
//                 <button
//                     onClick={handleHederaSignIn}
//                     disabled={isLoading}
//                     className="bg-white mb-2 flex items-center justify-center gap-4 text-xl w-full p-4 font-semibold text-black rounded-full border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
//                 >
//                     <span className="w-6 h-6">
//                         <img src={hederalogo} alt="Hedera logo" />
//                     </span>
//                     Continue with Hedera
//                 </button>

//                 {/* Google Button */}
//                 <button
//                     onClick={handleGoogleSignIn}
//                     disabled={isLoading}
//                     className="bg-white mb-2 flex items-center justify-center gap-4 text-xl w-full p-4 font-semibold text-black rounded-full border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
//                 >
//                     <span>
//                         <img src={goggleicon} alt="Google logo" />
//                     </span>
//                     Continue with Google
//                 </button>
//             </div>

//             {/* Login Link */}
//             <div>
//                 <p className="text-center text-sm text-gray-600 mt-4">
//                     Already have an account?{" "}
//                     <span
//                         onClick={handleLoginClick}
//                         className="text-blue-500 cursor-pointer hover:underline"
//                     >
//                         Login
//                     </span>
//                 </p>
//             </div>
//         </div>
//     );
// }