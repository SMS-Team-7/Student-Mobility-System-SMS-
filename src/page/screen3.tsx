import { useState } from 'react';
import { backarrow } from "../assets/images";
import Back from '../onboarding/shared/back';
import { useNavigate } from 'react-router-dom';

interface AuthScreenProps {
    onCreateAccount?: (contact: string) => Promise<void>;
    onLogin?: () => void;
}

export function AuthScreen({ onLogin }: AuthScreenProps = {}) {
    const navigate = useNavigate();

    const [contact, setContact] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Validate that it's a proper email address
    const validateContact = (value: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    };

    const handleCreateAccount = async () => {
        console.log('=== Starting OTP Setup ===');
        console.log('Email entered:', contact);

        // Clear any previous errors
        setError('');

        // Validate the email input
        if (!contact.trim()) {
            console.log('Validation failed: email is empty');
            setError('Please enter your email address');
            return;
        }

        if (!validateContact(contact)) {
            console.log('Validation failed: invalid email format');
            setError('Please enter a valid email address');
            return;
        }

        console.log('Validation passed, calling OTP setup API...');
        setIsLoading(true);

        try {
            // STEP 1: Call the /otp/setup/ endpoint to send verification code
            console.log('Making request to /otp/setup/');

            const response = await fetch('https://team-7-api.onrender.com/otp/setup/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Note: If this endpoint requires authentication and you have a token, add it here:
                    // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
            });

            console.log('Response received with status:', response.status);

            // STEP 2: Check if the request was successful
            if (!response.ok) {
                console.error('API request failed with status:', response.status);

                // Try to extract error message from the server response
                let errorMessage = 'Failed to send verification code';

                try {
                    const errorData = await response.json();
                    console.error('Server error response:', errorData);

                    // The server might send the error message in different fields
                    errorMessage = errorData.message || errorData.error || errorData.detail || errorMessage;

                } catch (parseError) {
                    console.error('Could not parse error response');
                }

                // Provide specific error messages based on status code
                if (response.status === 401) {
                    throw new Error('Authentication required. This endpoint may require you to be logged in first.');
                } else if (response.status === 403) {
                    throw new Error('Access forbidden. You do not have permission to access this endpoint.');
                } else if (response.status === 404) {
                    throw new Error('Endpoint not found. Please check the API URL.');
                } else if (response.status === 429) {
                    throw new Error('Too many requests. Please wait a moment and try again.');
                } else if (response.status >= 500) {
                    throw new Error('Server error. Please try again later.');
                } else {
                    throw new Error(errorMessage);
                }
            }

            // STEP 3: Parse the successful response
            const data = await response.json();
            console.log('OTP setup successful! Response data:', data);

            // STEP 4: Store the email for the verification screen
            localStorage.setItem('pendingEmail', contact.trim());
            console.log('Stored email in localStorage');

            // STEP 5: Store any session/verification ID that the server returned
            // Check what fields your API returns and adjust accordingly
            if (data.sessionId) {
                localStorage.setItem('otpSessionId', data.sessionId);
                console.log('Stored session ID:', data.sessionId);
            } else if (data.verificationId) {
                localStorage.setItem('otpSessionId', data.verificationId);
                console.log('Stored verification ID:', data.verificationId);
            } else if (data.otp_id) {
                localStorage.setItem('otpSessionId', data.otp_id);
                console.log('Stored OTP ID:', data.otp_id);
            }

            // Log the entire response so you can see what fields are available
            console.log('Complete API response:', JSON.stringify(data, null, 2));

            // STEP 6: Navigate to the verification code screen
            console.log('Navigating to verification screen...');
            navigate('/verify-code', {
                state: {
                    email: contact.trim(),
                    timestamp: Date.now(),
                }
            });
            console.log('Navigation successful!');

        } catch (err) {
            // STEP 7: Handle any errors
            console.error('Error during OTP setup:', err);

            // Check if it's a network error
            if (err instanceof TypeError && err.message.includes('fetch')) {
                setError('Network error. Please check your internet connection and try again.');
            } else {
                setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
            }

        } finally {
            // STEP 8: Always reset loading state
            setIsLoading(false);
            console.log('=== OTP Setup Completed ===');
        }
    };

    const handleLoginClick = () => {
        console.log('Login clicked');
        if (onLogin) {
            onLogin();
        } else {
            console.log('Would navigate to login screen');
            // navigate('/login');
        }
    };

    return (
        <div className='h-screen bg-gradient-to-br from-emerald-50 to-teal-50 w-full px-4 py-8 flex flex-col justify-between'>
            <div>
                <Back
                    image={backarrow}
                    title="Hello there"
                    text="Enter your email address and we'll send you a verification code"
                />

                <div className='w-full space-y-2'>
                    <input
                        type="email"
                        value={contact}
                        onChange={(e) => {
                            console.log('Input changed to:', e.target.value);
                            setContact(e.target.value);
                        }}
                        placeholder='Enter your email address'
                        className={`border w-full p-3 rounded-lg ${error ? 'border-red-500' : 'border-gray-300'}`}
                        disabled={isLoading}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                console.log('Enter key pressed');
                                handleCreateAccount();
                            }
                        }}
                    />

                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}
                </div>
            </div>

            <div className="w-full pb-8 space-y-4">
                <p className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <span
                        onClick={handleLoginClick}
                        className="text-blue-500 cursor-pointer hover:underline"
                    >
                        Login
                    </span>
                </p>

                <button
                    className="bg-[#00C317] text-xl w-full p-4 font-semibold text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
                    onClick={() => {
                        console.log('Create Account button clicked');
                        handleCreateAccount();
                    }}
                    disabled={isLoading}
                >
                    {isLoading ? 'Sending code...' : 'Create Account'}
                </button>

                <p className="text-left text-sm text-gray-500 mt-4">
                    By creating an account, I agree to Hedera's{" "}
                    <span className="text-blue-500 cursor-pointer hover:underline">
                        Terms of Service
                    </span> and{" "}
                    <span className="text-blue-500 cursor-pointer hover:underline">
                        Privacy Policy
                    </span>
                </p>
            </div>
        </div>
    );
}