import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MessageSquare,
  ChevronDown,
  CheckCircle,
  XCircle,
} from "lucide-react";

// 🧩 Mock Data for FAQs
const mockFaqs = [
  {
    id: 1,
    question: "How do I reset my password?",
    answer:
      "Go to Settings → Account Information → Change Password. You can reset it securely there.",
  },
  {
    id: 2,
    question: "Where can I view my past rides?",
    answer:
      "Head to your Profile → Rides tab. You’ll find all past, ongoing, and cancelled rides there.",
  },
  {
    id: 3,
    question: "How can I contact support?",
    answer:
      "Use the chat button or send us an email via the contact form below. Our team replies within 24 hours.",
  },
  {
    id: 4,
    question: "How can I update my payment method?",
    answer:
      "Go to Profile → Manage Payment. You can add, remove, or set your preferred payment option.",
  },
];

export default function SupportPage() {
  // ✅ UI & State Management
  const [faqs, setFaqs] = useState(mockFaqs);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [modalText, setModalText] = useState("");
  const autoCloseRef = useRef<number | null>(null);

  // ✅ Simulate fetching data
  useEffect(() => {
    setLoading(true);
    // 🔗 Backend Integration Point (Fetch FAQs)
    // Replace with actual backend call:
    // const res = await axios.get("/api/faqs");
    // setFaqs(res.data);
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  // ✅ Filter FAQs based on search input
  const filteredFaqs = faqs.filter((f) =>
    f.question.toLowerCase().includes(search.toLowerCase())
  );

  // show modal helper
  const openModal = (type: "success" | "error", text: string) => {
    // clear previous auto-close if any
    if (autoCloseRef.current) {
      window.clearTimeout(autoCloseRef.current);
      autoCloseRef.current = null;
    }

    setModalType(type);
    setModalText(text);
    setModalOpen(true);

    // auto close after 3s
    autoCloseRef.current = window.setTimeout(() => {
      setModalOpen(false);
      autoCloseRef.current = null;
    }, 3000);
  };

  const closeModal = () => {
    if (autoCloseRef.current) {
      window.clearTimeout(autoCloseRef.current);
      autoCloseRef.current = null;
    }
    setModalOpen(false);
  };

  // ✅ Handle message submission (Mock send)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !message) {
      openModal("error", "Please provide your email and a message.");
      return;
    }

    try {
      // 🔗 Backend Integration Point (Send Message)
      // Example:
      // await fetch("/api/support/message", { method: "POST", body: JSON.stringify({ email, message }) });
      console.log("Mock Message Sent:", { email, message }); // debug only

      setSent(true);
      setMessage("");
      setEmail("");

      // show nice success modal (pri green)
      openModal("success", "Thanks! Our team will get back to you soon.");
    } catch (err) {
      console.error(err);
      openModal("error", "Failed to send message. Please try again later.");
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -25 }}
        transition={{ duration: 0.3 }}
        className="max-w-md mx-auto px-4 py-6 space-y-6"
      >
        {/* Header */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Support Center
          </h2>
          <p className="text-gray-500 text-sm">
            Find answers or reach out for help anytime.
          </p>
        </div>

        {/* 🔍 Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search help topics..."
            className="w-full p-3 border border-pri/20 outline-none focus:outline-none text-base rounded-md focus:ring-2 focus:ring-pri dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        {/* 💬 FAQ Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">
            Frequently Asked Questions
          </h3>

          {loading ? (
            <p className="text-center text-gray-500">Loading FAQs...</p>
          ) : filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <div
                key={faq.id}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl border mb-1 border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <button
                  onClick={() => setExpanded(expanded === index ? null : index)}
                  className="w-full flex justify-between items-center p-4 text-left"
                >
                  <span className="font-medium text-gray-800 dark:text-gray-100">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${
                      expanded === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {expanded === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4 text-gray-600 dark:text-gray-300 text-sm"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm text-center py-6">
              No results found for “{search}”.
            </p>
          )}
        </div>

        {/* ☎ Contact Support Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">
            Contact Support
          </h3>

          <div className="flex flex-col gap-3">
            {/* 🔗 Backend Integration Point (Dynamic contact details) */}
            <a
              href="tel:+1234567890"
              className="flex items-center gap-3 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300 p-3 rounded-xl hover:bg-green-100 dark:hover:bg-green-800/50 transition"
            >
              <Phone size={20} />
              Call Us
            </a>

            <a
              href="mailto:support@app.com"
              className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 p-3 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-800/50 transition"
            >
              <Mail size={20} />
              Email Support
            </a>

            <button
              onClick={() =>
                openModal("success", "Chat feature coming soon...")
              }
              className="flex items-center gap-3 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 p-3 rounded-xl hover:bg-yellow-100 dark:hover:bg-yellow-800/50 transition"
            >
              <MessageSquare size={20} />
              Start Live Chat
            </button>
          </div>
        </div>

        {/* 📨 Email Form */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">
            Send us a Message
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              placeholder="Your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-pri/20 outline-none focus:outline-none text-base rounded-xl focus:ring-2 focus:ring-pri dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />

            <textarea
              placeholder="Write your message..."
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 border border-pri/20 rounded-md h-28 outline-none focus:outline-none focus:ring-2 focus:ring-pri dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={!email || !message}
              className="w-full bg-pri text-white font-semibold cursor-pointer py-3 rounded-md hover:bg-green-600 transition disabled:opacity-50"
            >
              {sent ? "✅ Message Sent!" : "Send Message"}
            </motion.button>
          </form>
        </div>
      </motion.div>

      {/* ------- Centered Modal (success / error) ------- */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            aria-modal="true"
            role="dialog"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ y: 30, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 30, scale: 0.98, opacity: 0 }}
              transition={{ type: "spring", stiffness: 160, damping: 18 }}
              className="relative z-60 w-[90%] max-w-sm bg-white rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex flex-col items-center gap-4 text-center">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center ${
                    modalType === "success" ? "bg-pri/10" : "bg-red-100"
                  }`}
                >
                  {modalType === "success" ? (
                    <CheckCircle className="w-12 h-12 text-pri" />
                  ) : (
                    <XCircle className="w-12 h-12 text-red-600" />
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-800">
                  {modalType === "success"
                    ? "Message sent"
                    : "Something went wrong"}
                </h3>

                <p className="text-sm text-gray-600">{modalText}</p>

                <div className="mt-2">
                  <button
                    onClick={closeModal}
                    className={`px-6 py-2 rounded-full font-semibold ${
                      modalType === "success"
                        ? "bg-pri text-white hover:bg-green-600"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  >
                    OK
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
