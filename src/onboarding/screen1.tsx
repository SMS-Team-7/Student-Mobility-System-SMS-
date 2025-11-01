import Image1 from "../assets/images-and-icons/hedera23.svg";
import Onboarding from "./shared/hero";

import { useNavigate } from "react-router-dom";
export default function screen1() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    console.log("Button clicked, attempting to navigate");
    navigate("/welcome");
  };

  return (
    <div>
      <Onboarding image={Image1} onButtonClick={handleGetStarted} />
    </div>
  );
}
