// import Button from "./button";

// interface onboardingProps {
//     title?: string;
//     image?: string;
//     buttonText?: string;
//     icon?: string;
//     onButtonClick?: () => void;
// }




// export default function Onboarding({
//     title,
//     image,

// }: onboardingProps) {

//     return (



//         <div className="h-screen bg-gradient-to-br from-emerald-50 to-teal-50 w-full flex flex-col justify-between" >
//             <div className="flex flex-col h-screen items-center justify-between w-full p-6">

//                 <div className="pt-8">
//                     <h1 className="text-2xl font-bold text-gray-900">
//                         {title}
//                     </h1>
//                 </div>

//                 {/* Center image - takes remaining space and centers */}
//                 <div className="flex-1 flex justify-center items-center">
//                     <span>
//                         <img src={image} alt="right-icon" />
//                     </span>
//                 </div>


//             </div>
//         </div>

//     );



// }




interface onboardingProps {
    title?: string;
    image?: string;
    buttonText?: string;
    icon?: string;
    onButtonClick?: () => void;
}

export default function Onboarding({
    title,
    image,
    buttonText,
    onButtonClick,  // Added this here - now we're extracting it from props
}: onboardingProps) {

    return (
        <div className="h-screen bg-gradient-to-br from-emerald-50 to-teal-50 w-full flex flex-col justify-between">
            <div className="flex flex-col h-screen items-center justify-between w-full p-6">

                <div className="pt-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {title}
                    </h1>
                </div>

                <div className="flex-1 flex justify-center items-center">
                    <span>
                        <img src={image} alt="right-icon" />
                    </span>
                </div>

                <div className="w-full pb-8">
                    <button
                        className="bg-[#00C317] text-lg w-full p-2 font-semibold text-white rounded-md"
                        onClick={onButtonClick}
                    >
                        {buttonText || "Get Started"}
                    </button>
                </div>
            </div>
        </div>
    );
}