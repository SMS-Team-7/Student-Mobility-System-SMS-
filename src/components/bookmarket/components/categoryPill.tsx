// import React from "react";

// export default function CategoryPill({
//     label,
//     active,
//     onClick,
//     icon
// }: {
//     label: string;
//     active?: boolean;
//     onClick?: () => void;
//     icon?: React.ReactNode;
// }) {
//     return (
//         <button
//             onClick={onClick}
//             className={`flex flex-col items-center justify-center gap-1 min-w-[68px] px-3 py-2 rounded-xl ${active ? "bg-white shadow-md" : "bg-transparent"
//                 }`}
//         >
//             <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-lg">
//                 {icon ?? "📘"}
//             </div>
//             <div className="text-xs text-gray-700">{label}</div>
//         </button>
//     );
// }

// export default function CategoryPill({
//     label,
//     active,
//     onClick,
//     icon,
// }: {
//     label: string;
//     active?: boolean;
//     onClick?: () => void;
//     icon?: string; // image URL
// }) {
//     return (
//         <button
//             onClick={onClick}
//             className={`flex flex-col items-center justify-center gap-1 min-w-[68px] px-3 py-2 rounded-xl transition-all
//         ${active ? "bg-[#FFF4E0] shadow-md" : "bg-transparent"}
//       `}
//         >
//             <div
//                 className={`w-12 h-12 rounded-full flex items-center justify-center transition-all
//           ${active ? "bg-[#D6A77A]" : "bg-[#D1FADF]"} /* brown when active, light green the rest */
//         `}
//             >
//                 <img src={icon} alt={label} className="w-6 h-6 object-contain" />
//             </div>

//             <span
//                 className={`text-xs transition-all
//           ${active ? "text-[#8C5A3E] font-semibold" : "text-gray-700"}
//         `}
//             >
//                 {label}
//             </span>
//         </button>
//     );
// }

import type { ReactNode } from "react";

export default function CategoryPill({
    label,
    active,
    onClick,
    Icon,
}: {
    label: string;
    active?: boolean;
    onClick?: () => void;
    Icon: ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            className={`
        flex flex-col items-center gap-1 px-4 py-2 min-w-[70px]
        ${active ? "font-semibold" : ""}
      `}
        >
            <div
                className={`
          w-12 h-12 rounded-full flex items-center justify-center transition-all
          ${active ? "bg-white shadow-md" : "bg-[#D1FADF]"}
        `}
            >
                <span
                    className={`transition-colors ${active ? "text-[#A06F3F]" : "text-black"
                        }`}
                >
                    {Icon}
                </span>
            </div>

            <span
                className={`text-xs transition-all ${active ? "text-[#A06F3F]" : "text-gray-700"
                    }`}
            >
                {label}
            </span>
        </button>
    );
}

