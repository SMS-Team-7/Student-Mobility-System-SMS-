
// import OtpField from "./shared/otpField";
// import { useState } from "react";
// import { backarrow } from "../assets/images";
// import Back from "./shared/back";

// export default function Screen4() {
//     const [otpCode, setOtpCode] = useState<string[]>(["", "", "", "", "", ""]);
//     const handleOtpChange = (index: number, value: string) => {
//         const newOtpCode = [...otpCode];
//         newOtpCode[index] = value;
//         setOtpCode(newOtpCode);
//     };

//     return (
//         <div className="h-screen bg-gradient-to-br from-emerald-50 to-teal-50 w-full px-4 py-12 flex flex-col justify-between">
//             <div>
//                 <Back
//                     image={backarrow}
//                     title="Enter Code"
//                     text="Enter the six digit code sent to your mail for confirmation"

//                 />


//                 <div className="px-2 w-[100%]">
//                     <form className="w-[100%]">
//                         <OtpField
//                             otpCode={otpCode}
//                             onOtpChange={handleOtpChange}
//                             inputStyling="text-wassetBlack text-center py-3 text-xl rounded-lg border border-[#00C317] w-12 h-12 focus:border-2 focus:border-green-500 focus:outline-none"
//                             containerStyling="flex justify-between gap-3 my-8 w-full max-w-sm mx-auto "
//                         />

//                     </form>
//                     <p className="text-right">

//                         <a href="#" className="text-[#00C317]">
//                             Resend OTP
//                         </a>
//                     </p>
//                 </div>

//             </div>
//             <div>
//                 <p className="text-center text-sm text-gray-600">
//                     Already have an account?{" "}
//                     <span className="text-blue-500 cursor-pointer">
//                         Login
//                     </span>
//                 </p>
//             </div>
//         </div>
//     );
// }
