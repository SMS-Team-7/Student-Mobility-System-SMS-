// import { useRef, useEffect } from "react";

// import { type ChangeEvent } from 'react';

// interface OtpFieldProps {
//     otpCode: string[] | undefined;
//     onOtpChange?: (index: number, value: string) => void;
//     inputStyling: string;
//     containerStyling: string;
// }

// export default function OtpField({
//     otpCode,
//     onOtpChange,
//     inputStyling,
//     containerStyling,
// }: OtpFieldProps) {
//     const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));
//     useEffect(() => {
//         if (inputRefs.current[0]) {
//             inputRefs.current[0]?.focus();
//         }
//     }, []);
//     const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
//         const value = e.target.value;
//         onOtpChange && onOtpChange(index, value);

//         if (value !== "" && inputRefs.current[index + 1]) {
//             inputRefs.current[index + 1]?.focus();
//         }
//     };

//     const handleBackspace = (e: { key: string }, index: number) => {
//         if (e.key === "Backspace" && index > 0) {
//             onOtpChange && onOtpChange(index, "");
//             inputRefs.current[index - 1]?.focus();
//         }
//     };

//     return (
//         <div>
//             <div className={`flex justify-between ${containerStyling}`}>
//                 {otpCode &&
//                     otpCode.map((input, index) => (
//                         <input
//                             key={index}
//                             type="text"
//                             className={`text-wassetBlack text-center focus:border-solid focus:border-wassetPurple focus:outline-none ${inputStyling}`}
//                             pattern="\d"
//                             maxLength={1}
//                             value={input}
//                             onChange={(e) => handleChange(e, index)}
//                             // ref={(el) => void (inputsRef.current[index] = el)}
//                             onKeyDown={(e) => handleBackspace(e, index)}
//                         />
//                     ))}
//             </div>
//         </div>
//     );
// }
