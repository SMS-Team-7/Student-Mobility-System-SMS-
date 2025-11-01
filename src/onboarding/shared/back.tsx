import { useNavigate } from "react-router-dom";

interface backProps {
  title?: string;
  text?: string;
  image?: string;
  onButtonClick?: () => void;
}

export default function Back({ title, text, image, onButtonClick }: backProps) {
  const navigate = useNavigate();
  return (
    <div className="py-4">
      <button
        className="pb-10"
        onClick={onButtonClick ? onButtonClick : () => navigate(-1)}
      >
        <img src={image} alt="back-icon" />
      </button>

      <div className="flex flex-col gap-5">
        <h2 className="font-extrabold text-2xl">{title}</h2>
        <p className="text-md">{text}</p>
      </div>
    </div>
  );
}
