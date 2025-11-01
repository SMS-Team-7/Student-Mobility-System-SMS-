import { useEffect } from "react";
import { useZxing } from "react-zxing";

interface QRScannerModalProps {
  onClose: () => void;
  onResult: (result: string) => void;
}

const QRScannerModal = ({ onClose, onResult }: QRScannerModalProps) => {
  // Setup QR scanner
  // @ts-ignore — allow react-zxing internal types to expose controls
  const { ref, controls } = useZxing({
    onDecodeResult(result) {
      const scannedText = result.getText();
      console.log("📸 Scanned QR:", scannedText);
      handleScanResult(scannedText);
    },
  });

  // ✅ Function to send QR data to backend
  const handleScanResult = async (scannedText: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to verify QR codes.");
        return;
      }

      const response = await fetch("https://team-7-api.onrender.com/scan-QR/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ qrData: scannedText }),
      });

      if (!response.ok) {
        throw new Error("QR verification failed");
      }

      const data = await response.json();
      console.log("✅ Backend Response:", data);

      alert("QR code verified successfully!");
      onResult(scannedText);
      onClose();
    } catch (error) {
      console.error("❌ Error verifying QR:", error);
      alert("Invalid or expired QR code. Please try again.");
    }
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-4 flex flex-col items-center w-[90%] max-w-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Scan QR Code
        </h2>

        <video ref={ref} className="w-full rounded-xl border border-gray-200" />

        <button
          onClick={() => controls?.torch?.toggle()}
          className="mt-4 text-white bg-green-600 px-4 py-2 rounded-xl text-sm font-medium shadow"
        >
          Toggle Flashlight
        </button>

        <button
          onClick={onClose}
          className="mt-2 text-gray-500 text-sm underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default QRScannerModal;
