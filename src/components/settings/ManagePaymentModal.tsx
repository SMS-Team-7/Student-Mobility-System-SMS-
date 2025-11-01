import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, PlusCircle, Trash2 } from "lucide-react";
import { useAuthContext } from "../../context/AuthContext";
import { nanoid } from "nanoid";

interface ManagePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ManagePaymentModal: React.FC<ManagePaymentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, updateUser } = useAuthContext();
  const [newCard, setNewCard] = useState({
    cardType: "",
    last4: "",
    expiry: "",
  });

  const cards = user?.paymentMethods || [];

  // Add new card
  const handleAddCard = () => {
    if (!newCard.cardType || !newCard.last4 || !newCard.expiry) return;
    const updatedCards = [...cards, { id: nanoid(), ...newCard }];
    updateUser({ paymentMethods: updatedCards });
    setNewCard({ cardType: "", last4: "", expiry: "" });
  };

  // 🗑 Delete card
  const handleDeleteCard = (id: string) => {
    const updatedCards = cards.filter((c) => c.id !== id);
    updateUser({ paymentMethods: updatedCards });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md p-6 shadow-xl"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Manage Payment Methods
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          {/* Existing Cards */}
          <div className="space-y-3 mb-6">
            {cards.length > 0 ? (
              cards.map((card) => (
                <div
                  key={card.id}
                  className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="text-green-600" size={20} />
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white">
                        {card.cardType} ****{card.last4}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Exp: {card.expiry}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteCard(card.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center">
                No payment methods added yet.
              </p>
            )}
          </div>

          {/* Add New Card */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">
              Add New Card
            </h3>
            <input
              placeholder="Card Type (e.g. Visa)"
              className="w-full border rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-800"
              value={newCard.cardType}
              onChange={(e) =>
                setNewCard({ ...newCard, cardType: e.target.value })
              }
            />
            <input
              placeholder="Last 4 Digits"
              maxLength={4}
              className="w-full border rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-800"
              value={newCard.last4}
              onChange={(e) =>
                setNewCard({ ...newCard, last4: e.target.value })
              }
            />
            <input
              placeholder="Expiry (MM/YY)"
              className="w-full border rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-800"
              value={newCard.expiry}
              onChange={(e) =>
                setNewCard({ ...newCard, expiry: e.target.value })
              }
            />

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleAddCard}
              className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg mt-2 flex items-center justify-center gap-2 hover:bg-green-700"
            >
              <PlusCircle size={18} />
              Add Card
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ManagePaymentModal;
