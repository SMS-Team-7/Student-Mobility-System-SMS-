

interface buttonProps {
    buttonText?: string;
    icon?: string;
    onButtonClick?: () => void;
}



export default function Button({

    buttonText,
    icon,
    onButtonClick,
}: buttonProps) {
    return (


        <div className="w-full pb-8">
            <button
                className="bg-[#00C317] text-xl w-full p-4 font-semibold text-white rounded-full"
                onClick={onButtonClick}

            >
                {buttonText}

                <span>{icon}</span>
            </button>
        </div>

    );



}


