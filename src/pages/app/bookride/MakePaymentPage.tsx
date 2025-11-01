import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, DollarSign } from "lucide-react";
import PaymentReminderModal from "./PaymentReminderModal";

interface LocationState {
  rider?: {
    name: string;
    img?: string;
    price?: string;
  };
}

const presetAmounts = [5, 10, 20, 50, 100, 200, 500, 1000];

const MakePaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { rider } = (location.state as LocationState) || {};

  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleSelectAmount = (value: number) => {
    setAmount(value.toString());
    setError("");
  };

  const handleContinue = () => {
    if (!amount.trim()) {
      setError("Please enter or select an amount before continuing.");
      return;
    }
    setError("");
    setShowModal(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col bg-linear-to-b from-green-50 to-white pb-10"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-6">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft className="w-5 h-5 text-black" />
        </button>
        <span className="font-semibold text-gray-800 text-sm">
          Make Payment
        </span>
      </div>

      {/* Payment details */}
      <div className="px-5">
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Payment Details
        </h2>
        <p className="text-sm text-gray-500 mb-5">
          Make your payments now through our secure payment gateway.
        </p>

        {/* Input */}
        <div className="flex flex-col gap-1 mb-4">
          <div className="flex items-center bg-white rounded-full shadow px-4 py-4 border border-pri/40 focus-within:border-pri transition-all">
            <input
              type="number"
              placeholder="Enter amount"
              className="flex-1 text-gray-800 text-base outline-none bg-transparent"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError("");
              }}
            />
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-pri">
              <DollarSign className="text-white" size={18} />
            </div>
          </div>

          {/* Inline error message */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-red-500 text-xs font-medium pl-3"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Preset buttons */}
        <div className="grid grid-cols-4 gap-3 mt-5">
          {presetAmounts.map((val) => (
            <button
              key={val}
              onClick={() => handleSelectAmount(val)}
              className={`rounded-full py-3 font-bold text-sm transition-all ${
                amount === val.toString()
                  ? "bg-pri text-white shadow-md"
                  : "bg-green-400/70 text-white hover:bg-green-500"
              }`}
            >
              ${val}
            </button>
          ))}
        </div>
      </div>
      <div className="px-5 mt-auto">
        {/* Continue button */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleContinue}
          className="w-full bg-pri text-white font-semibold py-4 rounded-full text-lg shadow-md hover:bg-green-700 transition"
        >
          Continue
        </motion.button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <PaymentReminderModal
            onClose={() => setShowModal(false)}
            amount={amount}
            riderName={rider?.name || "Unknown Rider"}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MakePaymentPage;
