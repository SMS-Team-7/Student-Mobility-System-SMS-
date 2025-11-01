import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface LocationState {
  amount?: string;
  riderName?: string;
}

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { amount, riderName } = (location.state as LocationState) || {};

  useEffect(() => {
    // Auto redirect after 4 seconds
    const timer = setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  const date = new Date().toLocaleString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col items-center justify-center bg-linear-to-b from-green-50 to-white text-center px-5"
    >
      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="mb-6"
      >
        <CheckCircle2 className="text-green-600 w-24 h-24 drop-shadow-lg" />
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold text-green-700 mb-2"
      >
        Payment Successful!
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-gray-600 mb-8 text-sm"
      >
        Your payment has been processed successfully. You’ll be redirected
        shortly.
      </motion.p>

      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white shadow-md border border-pri/40 rounded-2xl w-full max-w-md px-5 py-7"
      >
        <div className="flex justify-between text-gray-700 mb-2">
          <span className="font-medium">Rider:</span>
          <span className="font-semibold text-gray-900">
            {riderName || "Unknown Rider"}
          </span>
        </div>
        <div className="flex justify-between text-gray-700 mb-2">
          <span className="font-medium">Amount Paid:</span>
          <span className="font-semibold text-green-700">${amount || "0"}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span className="font-medium">Date:</span>
          <span className="text-gray-900 text-sm">{date}</span>
        </div>
      </motion.div>

      {/* Manual Back Button (in case auto nav is slow) */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/dashboard")}
        className="mt-8 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold text-sm shadow"
      >
        Back to Home
      </motion.button>
    </motion.div>
  );
};

export default PaymentSuccess;
