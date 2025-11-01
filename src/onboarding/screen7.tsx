import { sucessfullicon } from "../assets/images";
import { useNavigate } from "react-router-dom";

export default function screen7() {
  const navigate = useNavigate();
  return (
    <div className="h-screen bg-[#00C317] w-full flex flex-col justify-between">
      <div className="flex flex-col h-screen items-center justify-between w-full p-6">
        <div className="mt-30">
          {/* Center image - takes remaining space and centers */}
          <div className="">
            <span>
              <img src={sucessfullicon} alt="right-icon" />
            </span>
            <p className="text-2xl text-white">Account Created Successfully</p>
          </div>
        </div>
        <div className="w-full pb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-white text-[#00C317] text-xl w-full p-4 font-semibold  rounded-full"
          >
            Go back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
