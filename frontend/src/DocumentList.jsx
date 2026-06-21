import { useState, useEffect } from "react";

export default function DocumentList({ onLogout }) {
    const [documents, setDocuments] = useState([]);
    const [filter, setFilter] = useState("ALL");
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetch("https://signature-app-backend-b82o.onrender.com/document", {
            headers: { Authorization: "Bearer " + token },
        })
            .then((res) => res.json())
            .then((data) => { if (Array.isArray(data)) setDocuments(data); });
    }, []);

    const filtered = filter === "ALL" ? documents :
        documents.filter((d) => d.status === filter);

    const statusColor = (status) => {
        if (status === "SIGNED") return "bg-green-100 text-green-700 border border-green-300";
        if (status === "REJECTED") return "bg-red-100 text-red-700 border border-red-300";
        return "bg-yellow-100 text-yellow-700 border border-yellow-300";
    };

    const filterColor = (s) => filter === s
        ? "bg-blue-600 text-white shadow-md"
        : "bg-white text-gray-500 hover:bg-blue-50 border border-gray-200";

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-3xl mx-auto">

                <div className="mb-8 flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-bold text-indigo-800">Document Signature App</h1>
                        <p className="text-gray-500 mt-1">Manage and track your documents</p>
                    </div>
                    <button
                        onClick={onLogout}
                        className="px-4 py-2 rounded-full text-sm font-semibold bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 transition-all"
                    >
                        Logout
                    </button>
                </div>

                <div className="flex gap-3 mb-6 flex-wrap">
                    {["ALL", "PENDING", "SIGNED", "REJECTED"].map((s) => (
                        <button key={s} onClick={() => setFilter(s)}
                                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${filterColor(s)}`}>
                            {s}
                        </button>
                    ))}
                </div>

                <div className="grid gap-4">
                    {filtered.length === 0 && (
                        <p className="text-center text-gray-400 mt-10">No documents found.</p>
                    )}
                    {filtered.map((doc) => (
                        <div key={doc.id}
                             className="bg-white rounded-2xl shadow-lg p-6 flex justify-between items-center hover:shadow-xl transition-shadow border border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="bg-indigo-100 p-3 rounded-xl text-2xl">📄</div>
                                <div>
                                    <p className="font-bold text-gray-800 text-sm">{doc.fileName}</p>
                                    <p className="text-xs text-gray-400 mt-1">👤 {doc.uploadedBy}</p>
                                    <p className="text-xs text-gray-400">📅 {doc.uploadedAt?.slice(0, 10)}</p>
                                </div>
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${statusColor(doc.status)}`}>
                {doc.status || "PENDING"}
              </span>
                        </div>
                    ))}
                </div>

                <p className="text-center text-xs text-gray-400 mt-8">
                    {filtered.length} document{filtered.length !== 1 ? "s" : ""} found
                </p>
            </div>
        </div>
    );
}