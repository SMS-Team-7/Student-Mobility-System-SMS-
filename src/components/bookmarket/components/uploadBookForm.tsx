// import { useState } from "react";
// import { Upload, X } from "lucide-react";
// import type { Book } from "../types";

// interface UploadBookFormProps {
//     onClose?: () => void;
//     onUploadSuccess?: (book: Book) => void;
// }

// export default function UploadBookForm({ onClose, onUploadSuccess }: UploadBookFormProps) {
//     const [formData, setFormData] = useState({
//         title: "",
//         description: "",
//         book_type: "past_question",
//         file: null as File | null,
//         is_free: true,
//         price: "0"
//     });
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//         const { name, value, type } = e.target;
//         const checked = (e.target as HTMLInputElement).checked;

//         setFormData(prev => ({
//             ...prev,
//             [name]: type === 'checkbox' ? checked : value,
//             ...(name === 'is_free' && checked ? { price: '0' } : {})
//         }));
//     };

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files && e.target.files[0]) {
//             setFormData(prev => ({ ...prev, file: e.target.files![0] }));
//         }
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setLoading(true);
//         setError("");

//         try {
//             const formDataToSend = new FormData();
//             formDataToSend.append("title", formData.title);
//             formDataToSend.append("description", formData.description);
//             formDataToSend.append("book_type", formData.book_type);
//             if (formData.file) {
//                 formDataToSend.append("file", formData.file);
//             }
//             formDataToSend.append("is_free", formData.is_free.toString());
//             formDataToSend.append("price", formData.is_free ? "0" : formData.price);


//             const token = localStorage.getItem("authToken");
//             // instead of access_token


//             const response = await fetch("https://team-7-api.onrender.com/library/books/upload/", {
//                 method: "POST",
//                 headers: {
//                     "Authorization": `Bearer ${token}`,
//                 },
//                 body: formDataToSend,
//             });


//             if (!response.ok) {
//                 const errorDetails = await response.json().catch(() => null);
//                 console.error("Upload error details:", errorDetails);
//                 throw new Error(errorDetails?.detail || errorDetails?.error || "Upload failed");
//             }


//             // if (!response.ok) {
//             //     throw new Error(`Upload failed: ${response.statusText}`);
//             // }

//             const result = await response.json();

//             // Call success callback if provided
//             if (onUploadSuccess) {
//                 onUploadSuccess(result);
//             }

//             // Reset form
//             setFormData({
//                 title: "",
//                 description: "",
//                 book_type: "past_question",
//                 file: null,
//                 is_free: true,
//                 price: "0"
//             });

//             // Close modal/page if callback provided
//             if (onClose) {
//                 onClose();
//             }
//         } catch (err: any) {
//             setError(err.message || "Failed to upload book");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl mx-auto">
//             <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-2xl font-bold text-gray-800">Upload Your Book</h2>
//                 {onClose && (
//                     <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
//                         <X size={24} />
//                     </button>
//                 )}
//             </div>

//             {error && (
//                 <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
//                     {error}
//                 </div>
//             )}

//             <div className="space-y-4">
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Title <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                         type="text"
//                         name="title"
//                         value={formData.title}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                         placeholder="Enter book title"
//                         required
//                     />
//                 </div>

//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Description <span className="text-red-500">*</span>
//                     </label>
//                     <textarea
//                         name="description"
//                         value={formData.description}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                         rows={4}
//                         placeholder="Describe your book..."
//                         required
//                     />
//                 </div>

//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Book Type <span className="text-red-500">*</span>
//                     </label>
//                     <input type="hidden" name="book_type" value="past_question" />
//                     <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
//                         Upload Type: <strong>Past Question</strong>
//                     </p>

//                 </div>

//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Upload File <span className="text-red-500">*</span>
//                     </label>
//                     <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
//                         <input
//                             type="file"
//                             onChange={handleFileChange}
//                             className="hidden"
//                             id="file-upload"
//                             accept=".pdf,.doc,.docx"
//                             required
//                         />
//                         <label htmlFor="file-upload" className="cursor-pointer">
//                             <Upload className="mx-auto mb-2 text-gray-400" size={32} />
//                             <p className="text-sm text-gray-600">
//                                 {formData.file ? formData.file.name : "Click to upload or drag and drop"}
//                             </p>
//                             <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX (MAX. 50MB)</p>
//                         </label>
//                     </div>
//                 </div>

//                 <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
//                     <input
//                         type="checkbox"
//                         name="is_free"
//                         checked={formData.is_free}
//                         onChange={handleInputChange}
//                         className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
//                         id="is-free"
//                     />
//                     <label htmlFor="is-free" className="text-sm font-medium text-gray-700">
//                         Make this book free
//                     </label>
//                 </div>

//                 {!formData.is_free && (
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Price (₦)
//                         </label>
//                         <input
//                             type="number"
//                             name="price"
//                             value={formData.price}
//                             onChange={handleInputChange}
//                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                             min="0"
//                             step="0.01"
//                             placeholder="Enter price"
//                         />
//                     </div>
//                 )}

//                 <button
//                     onClick={handleSubmit}
//                     disabled={loading || !formData.title || !formData.description || !formData.file}
//                     className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                     {loading ? (
//                         <>
//                             <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                             Uploading...
//                         </>
//                     ) : (
//                         <>
//                             <Upload size={20} />
//                             Upload Book
//                         </>
//                     )}
//                 </button>
//             </div>
//         </div>
//     );
// }

import { useState } from "react";
import { X } from "lucide-react";
import type { Book } from "../types";

export default function UploadBookForm({ onClose, onUploadSuccess }: any) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        book_type: "past_question",
        file: null as File | null,
        is_free: true,
        price: "0",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const user = JSON.parse(localStorage.getItem("user") || "{}"); // ✅ read logged in user

    const handleInputChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
            ...(name === "is_free" && checked ? { price: "0" } : {})
        }));
    };

    const handleFileChange = (e: any) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, file: e.target.files[0] }));
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("authToken");
            const fd = new FormData();
            fd.append("title", formData.title);
            fd.append("description", formData.description);
            fd.append("book_type", formData.book_type);
            if (formData.file) fd.append("file", formData.file);
            fd.append("is_free", formData.is_free.toString());
            fd.append("price", formData.is_free ? "0" : formData.price);

            const res = await fetch(
                "https://team-7-api.onrender.com/library/books/upload/",
                {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: fd
                }
            );

            if (!res.ok) {
                const err = await res.json().catch(() => null);
                throw new Error(err?.detail || "Upload failed");
            }

            const result = await res.json();

            // ✅ Use real file url from backend
            const newBook: Book = {
                ...result,
                uploaded_by: {
                    id: user?.id || 0,
                    username: user?.username || "You"
                },
            };

            // ✅ Save locally to show instantly
            const savedBooks = JSON.parse(localStorage.getItem("uploadedBooks") || "[]");
            localStorage.setItem("uploadedBooks", JSON.stringify([newBook, ...savedBooks]));

            onUploadSuccess?.(newBook);
            onClose?.();

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl p-6">
            <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold">Upload Book</h2>
                <button onClick={onClose}><X /></button>
            </div>

            {error && <p className="text-red-600">{error}</p>}

            <div className="space-y-3">
                <input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Book title"
                    className="w-full border p-2 rounded"
                />

                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                    className="w-full border p-2 rounded"
                />

                <select
                    name="book_type"
                    value={formData.book_type}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                >
                    <option value="past_question">Past Question</option>
                    <option value="textbook">Textbook</option>
                    <option value="reference">Reference</option>
                    <option value="novel">Novel</option>
                </select>

                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="w-full"
                />

                <label className="flex gap-2 text-sm">
                    <input
                        type="checkbox"
                        name="is_free"
                        checked={formData.is_free}
                        onChange={handleInputChange}
                    />
                    Make free
                </label>

                {!formData.is_free && (
                    <input
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        type="number"
                        placeholder="Price"
                        className="w-full border p-2 rounded"
                    />
                )}

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-green-600 text-white p-2 rounded"
                >
                    {loading ? "Uploading..." : "Upload Book"}
                </button>
            </div>
        </div>
    );
}
