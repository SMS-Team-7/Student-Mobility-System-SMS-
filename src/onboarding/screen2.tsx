import Onboarding from "./shared/hero";

import Image1 from "../assets/images-and-icons/screen2.svg";
import { useNavigate } from "react-router-dom";

export default function Screen2() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    console.log("Button clicked, attempting to navigate");
    navigate("/signup");
  };

  return (
    <div className="h-screen bg-linear-to-br from-emerald-50 to-teal-50 w-full flex flex-col justify-between">
      <Onboarding
        title="Discover New Moments Within Campus And Others"
        image={Image1}
        onButtonClick={handleGetStarted}
      />
    </div>
  );
}
