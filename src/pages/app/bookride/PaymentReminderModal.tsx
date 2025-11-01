import { motion } from "framer-motion";
import { X } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

interface PaymentReminderModalProps {
  onClose: () => void;
  amount: string;
  riderName: string;
}

const PaymentReminderModal: React.FC<PaymentReminderModalProps> = ({
  onClose,
  amount,
  riderName,
}) => {
  const navigate = useNavigate();
  return (
    <motion.div
      className="fixed inset-0 flex items-end justify-center bg-black/60 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white w-full max-w-md  p-6 shadow-lg"
        initial={{ y: 200 }}
        animate={{ y: 0 }}
        exit={{ y: 200 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        {/* Header */}
        <div className="flex justify-center items-center mb-3">
          <h2 className="text-lg mx-auto font-semibold text-gray-800">
            Payment Reminder
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full shadow-sm bg-white cursor-pointer flex items-center justify-center"
          >
            <X className="w-5 h-5  text-gray-500" />
          </button>
        </div>

        <p className="text-sm text-center text-gray-600 mb-4">
          Double check the transfer details before you proceed. Please note that
          successful transfers cannot be reversed.
        </p>

        <div className="bg-pri/12 p-4 rounded-xl text-sm mb-5">
          <p className="font-bold text-[15px] text-gray-700 mb-3">
            Transaction Details
          </p>
          <p className="text-gray-700 font-bold">
            <span className="font-semibold">Name:</span> {riderName}
          </p>
          <p className="text-gray-700 font-bold my-2">
            <span className="font-semibold">Account No:</span> 1234567890
          </p>
          <p className="text-gray-700 font-bold">
            <span className="font-semibold">Amount:</span> ${amount || "0.00"}
          </p>
        </div>

        <div className="flex justify-between gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-full bg-gray-200 text-gray-700 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              navigate("/ride-payment-success", {
                state: { amount, riderName },
              })
            }
            className="flex-1 py-3 rounded-full bg-green-600 text-white font-semibold"
          >
            Confirm Payment
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PaymentReminderModal;
