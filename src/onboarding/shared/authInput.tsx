// import { goggleicon } from "../../assets/images";

// interface AuthInputProps {
//     name: string;
//     value?: string;
//     email?: boolean;
//     password?: boolean;
//     passwordType?: string;
// }
// export default function AuthInput({
//     name,
//     value,
//     email,
//     password,
//     passwordType,
// }: AuthInputProps) {
//     // const [showPassword, setShowPassword] = useState<boolean>(false);

//     // const togglePasswordVisibility = () => {
//     //     setShowPassword(!showPassword);
//     // };

//     return (
//         <div>
//             {email && (
//                 <div className="my-[1.2rem]">

//                     <div
//                         className={`flex items-center  border-[0.1rem] py-[1rem] px-[1.4rem] rounded-[.8rem] w-[100%] mt-[.6rem]`}
//                     >
//                         <div className="mr-[.8rem]">
//                             <img
//                                 src={goggleicon}
//                                 alt="email icon"
//                                 width="100%"
//                                 height="auto"
//                             />
//                         </div>
//                         <div className="w-[100%]">
//                             <input
//                                 type="email"
//                                 placeholder="enter email"
//                                 name={name}

//                                 value={value}
//                                 className="text-inputGrey text-[1.4rem] w-[100%] outline-none bg-white "
//                             />
//                         </div>

//                     </div>

//                 </div>
//             )}

//             {password && (
//                 <div className="my-[1.2rem]">
//                     <label className="text-[1.4rem] text-lorryBlack">
//                         {passwordType}
//                     </label>
//                     <div
//                         className={`flex items-center  border-[0.1rem] py-[1rem] px-[1.4rem] rounded-[.8rem] w-[100%] mt-[.6rem]`}
//                     >
//                         <div className="w-full">
//                             <input
//                                 type={showPassword ? "text" : "password"}
//                                 placeholder="enter password"
//                                 name={name}
//                                 value={value}
//                                 className="text-inputGrey text-[1.4rem] w-[100%] outline-none bg-white "
//                             />
//                         </div>
//                         {/* <div className="w-[2rem]" onClick={togglePasswordVisibility}>
//                             <img
//                                 src={goggleicon ? hidePasswordIcon : seePasswordIcon}
//                                 alt="hide or show password"
//                                 width="100%"
//                                 height="auto"
//                             />
//                         </div> */}
//                     </div>

//                 </div>
//             )}
//         </div>
//     );
// }
