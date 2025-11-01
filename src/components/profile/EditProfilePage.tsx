import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Camera } from "lucide-react";
import { useAuthContext } from "../../context/AuthContext";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { user, token, updateUser, logout, fetchProfile } = useAuthContext();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    username: user?.username || "",
    role: user?.role || "",
  });

  const [previewImage, setPreviewImage] = useState<string | null>(
    user?.profile_image || null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Modal state
  const [modal, setModal] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Automatically close modal after 3 seconds
  useEffect(() => {
    if (modal) {
      const timer = setTimeout(() => setModal(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [modal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setModal({
        type: "error",
        message: "Session expired. Please log in again.",
      });
      logout();
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        data.append(key, value)
      );
      if (selectedFile) data.append("profile_image", selectedFile);

      const response = await fetch("https://team-7-api.onrender.com/profile/", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      const resData = await response.json();

      if (response.status === 401) {
        setModal({
          type: "error",
          message: "Session expired. Please log in again.",
        });
        logout();
        navigate("/login");
        return;
      }

      if (!response.ok) {
        console.error("Profile update failed:", resData);
        setModal({
          type: "error",
          message: resData.detail || "Failed to update profile.",
        });
        return;
      }

      console.log("✅ Profile updated successfully:", resData);
      updateUser(resData);
      await fetchProfile(token);

      setModal({ type: "success", message: "Profile updated successfully!" });

      // Redirect after short delay
      setTimeout(() => {
        navigate(-1);
      }, 1200);
    } catch (err) {
      console.error("❌ Error updating profile:", err);
      setModal({
        type: "error",
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 80, damping: 18 }}
      className="min-h-screen bg-green-50 dark:bg-gray-900 p-5 relative"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="rounded-full cursor-pointer"
        >
          <ChevronLeft size={22} className="text-black dark:text-gray-200" />
        </button>
        <h2 className="text-xl font-bold text-black dark:text-gray-100">
          Edit Profile
        </h2>
      </div>

      {/* Avatar Section */}
      <div className="flex flex-col items-center gap-3 mb-8 relative">
        <div
          onClick={handleImageClick}
          className="relative w-24 h-24 rounded-full bg-pri dark:bg-gray-700 flex items-center justify-center text-white text-3xl font-semibold cursor-pointer overflow-hidden"
        >
          {previewImage ? (
            <img
              src={previewImage}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            (
              formData.first_name.charAt(0) ||
              formData.username.charAt(0) ||
              "?"
            ).toUpperCase()
          )}

          <div className="absolute bottom-2 right-2 bg-black/60 p-1 rounded-full">
            <Camera size={16} className="text-white" />
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <p className="text-sm text-green-600 font-medium">
          Tap to change photo
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {[
          { label: "First Name", name: "first_name", type: "text" },
          { label: "Last Name", name: "last_name", type: "text" },
          { label: "Email", name: "email", type: "email" },
          { label: "Username", name: "username", type: "text" },
          { label: "Role", name: "role", type: "text" },
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </label>
            <input
              type={type}
              name={name}
              value={formData[name as keyof typeof formData]}
              onChange={handleChange}
              placeholder={label}
              className="mt-1 w-full border border-pri/80 outline-none text-base dark:border-gray-700 p-3 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-pri"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold mt-6 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-pri hover:bg-green-600 transition"
          }`}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>

      {/* ✅ Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 max-w-sm w-full text-center"
            >
              <h3
                className={`text-lg font-semibold mb-3 ${
                  modal.type === "success" ? "text-green-600" : "text-red-500"
                }`}
              >
                {modal.type === "success" ? "Success" : "Error"}
              </h3>
              <p className="text-gray-700 dark:text-gray-200 mb-6">
                {modal.message}
              </p>
              <button
                onClick={() => setModal(null)}
                className="bg-pri text-white py-2 px-6 rounded-full font-medium hover:bg-green-600 transition"
              >
                OK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EditProfilePage;
