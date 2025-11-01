

export default function CTAButton({
    label,
    onClick,
    variant = "primary",
    disabled = false,
}: {
    label: string;
    onClick?: () => void;
    variant?: "primary" | "ghost" | "secondary";
    disabled?: boolean;
}) {
    const base = "w-full rounded-full py-3 font-semibold transition-colors";
    if (variant === "primary") {
        return (
            <button
                onClick={onClick}
                disabled={disabled}
                className={`${base} ${disabled ? "bg-gray-300 text-gray-700" : "bg-[#00C317] text-white hover:bg-green-600"}`}
            >
                {label}
            </button>
        );
    }
    return (
        <button onClick={onClick} disabled={disabled} className={`${base} bg-white text-black border`}>
            {label}
        </button>
    );
}
