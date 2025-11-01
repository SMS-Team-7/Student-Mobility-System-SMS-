

export default function ProgressBar({ percent = 0, small = false }: { percent?: number; small?: boolean }) {
    const capped = Math.max(0, Math.min(100, Math.round(percent)));
    return (
        <div className={small ? "w-full" : "w-full"}>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                    className="h-3 rounded-full transition-all duration-300"
                    style={{
                        width: `${capped}%`,
                        backgroundColor: "#00C317",
                    }}
                />
            </div>
            {!small && (
                <div className="text-xs text-gray-500 mt-1">{capped}% Complete</div>
            )}
        </div>
    );
}
