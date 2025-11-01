// import { useState } from 'react';
// import { backarrow } from "../assets/images";
// import Back from '../onboarding/shared/back';
// import { useNavigate } from 'react-router-dom';

// interface AuthScreenProps {
//     onCreateAccount?: (contact: string) => Promise<void>;
//     onLogin?: () => void;
// }

// export function AuthScreen({ onCreateAccount, onLogin }: AuthScreenProps = {}) {
//     const navigate = useNavigate();

//     const [contact, setContact] = useState('');
//     const [error, setError] = useState('');
//     const [isLoading, setIsLoading] = useState(false);

//     // Let's verify that navigate is actually a function
//     console.log('Navigate function available:', typeof navigate);

//     const validateContact = (value: string): boolean => {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         const phoneRegex = /^\+?[\d\s-()]{10,}$/;
//         return emailRegex.test(value) || phoneRegex.test(value);
//     };

//     const handleCreateAccount = async () => {
//         console.log('=== handleCreateAccount started ===');
//         console.log('Contact value:', contact);

//         setError('');

//         // Checkpoint 1: Did we get past the empty validation?
//         if (!contact.trim()) {
//             console.log('Validation failed: contact is empty');
//             setError('Please enter your email or phone number');
//             return;
//         }
//         console.log('Checkpoint 1 passed: contact is not empty');

//         // Checkpoint 2: Did we get past the format validation?
//         if (!validateContact(contact)) {
//             console.log('Validation failed: contact format is invalid');
//             setError('Please enter a valid email or phone number');
//             return;
//         }
//         console.log('Checkpoint 2 passed: contact format is valid');

//         setIsLoading(true);
//         console.log('Loading state set to true');

//         try {
//             console.log('Entered try block');

//             if (onCreateAccount) {
//                 console.log('Using custom onCreateAccount callback');
//                 await onCreateAccount(contact);
//             } else {
//                 console.log('No custom callback, using default behavior');

//                 // Simulate a small delay
//                 console.log('Starting simulated delay...');
//                 await new Promise(resolve => setTimeout(resolve, 800));
//                 console.log('Simulated delay completed');

//                 // Store the contact
//                 console.log('Storing contact in localStorage');
//                 localStorage.setItem('pendingContact', contact);
//                 console.log('Contact stored successfully');

//                 // This is the critical moment - attempting to navigate
//                 console.log('About to call navigate function');
//                 console.log('Navigate target: /verify-code');
//                 console.log('Navigate state:', { contact: contact.trim(), timestamp: Date.now() });

//                 navigate('/verify-code', {
//                     state: {
//                         contact: contact.trim(),
//                         timestamp: Date.now(),
//                     }
//                 });

//                 console.log('Navigate function called successfully');
//             }
//         } catch (err) {
//             console.error('Error caught in try-catch:', err);
//             console.error('Error details:', {
//                 message: err instanceof Error ? err.message : 'Unknown error',
//                 stack: err instanceof Error ? err.stack : 'No stack trace'
//             });
//             setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
//         } finally {
//             console.log('Finally block reached');
//             setIsLoading(false);
//             console.log('Loading state set to false');
//         }

//         console.log('=== handleCreateAccount completed ===');
//     };

//     const handleLoginClick = () => {
//         console.log('Login clicked');
//         if (onLogin) {
//             onLogin();
//         } else {
//             console.log('No custom login handler, would navigate to /login');
//         }
//     };

//     return (
//         <div className='h-screen bg-gradient-to-br from-emerald-50 to-teal-50 w-full px-4 py-8 flex flex-col justify-between'>
//             <div>
//                 <Back
//                     image={backarrow}
//                     title="Hello there"
//                     text="Enter your phone number or email address, We will send you a confirmation code there"
//                 />

//                 <div className='w-full space-y-2'>
//                     <input
//                         type="text"
//                         value={contact}
//                         onChange={(e) => {
//                             console.log('Input changed to:', e.target.value);
//                             setContact(e.target.value);
//                         }}
//                         placeholder='Enter email or phone number'
//                         className={`border w-full p-3 rounded-lg ${error ? 'border-red-500' : 'border-gray-300'}`}
//                         disabled={isLoading}
//                         onKeyPress={(e) => {
//                             if (e.key === 'Enter') {
//                                 console.log('Enter key pressed, calling handleCreateAccount');
//                                 handleCreateAccount();
//                             }
//                         }}
//                     />

//                     {error && (
//                         <p className="text-red-500 text-sm">{error}</p>
//                     )}
//                 </div>
//             </div>

//             <div className="w-full pb-8 space-y-4">
//                 <p className="text-center text-sm text-gray-600">
//                     Already have an account?{" "}
//                     <span
//                         onClick={handleLoginClick}
//                         className="text-blue-500 cursor-pointer hover:underline"
//                     >
//                         Login
//                     </span>
//                 </p>

//                 <button
//                     className="bg-[#00C317] text-xl w-full p-4 font-semibold text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
//                     onClick={() => {
//                         console.log('Create Account button clicked');
//                         handleCreateAccount();
//                     }}
//                     disabled={isLoading}
//                 >
//                     {isLoading ? 'Creating Account...' : 'Create Account'}
//                 </button>

//                 <p className="text-left text-sm text-gray-500 mt-4">
//                     By creating an account, I agree to Hedera's{" "}
//                     <span className="text-blue-500 cursor-pointer hover:underline">
//                         Terms of Service
//                     </span> and{" "}
//                     <span className="text-blue-500 cursor-pointer hover:underline">
//                         Privacy Policy
//                     </span>
//                 </p>
//             </div>
//         </div>
//     );
// }