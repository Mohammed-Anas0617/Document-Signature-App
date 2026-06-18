import { useState, useRef, useEffect, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { PDFDocument } from "pdf-lib";

// Set worker — works with Vite
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

// ─── Icons (inline SVG so no extra deps) ─────────────────────────────────────
const Icon = {
    ZoomIn: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
        </svg>
    ),
    ZoomOut: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            <line x1="8" y1="11" x2="14" y2="11"/>
        </svg>
    ),
    ChevLeft: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <polyline points="15 18 9 12 15 6"/>
        </svg>
    ),
    ChevRight: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <polyline points="9 18 15 12 9 6"/>
        </svg>
    ),
    Pen: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
    ),
    Trash: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
        </svg>
    ),
    Check: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
            <polyline points="20 6 9 17 4 12"/>
        </svg>
    ),
    Upload: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-8 h-8">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
    ),
    Close: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
    ),
};

// ─── Signature Canvas ─────────────────────────────────────────────────────────
function SignatureCanvas({ onSave, onClose }) {
    const [name, setName] = useState("");
    const [fontIndex, setFontIndex] = useState(0);

    const fonts = [
        { label: "Classic", style: "'Brush Script MT', cursive" },
        { label: "Elegant", style: "'Lucida Handwriting', cursive" },
        { label: "Bold", style: "'Segoe Script', cursive" },
        { label: "Simple", style: "'Comic Sans MS', cursive" },
    ];

    const save = () => {
        if (!name.trim()) return;

        const canvas = document.createElement("canvas");
        canvas.width = 600;
        canvas.height = 200;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#1a1a2e";
        ctx.font = `90px ${fonts[fontIndex].style}`;
        ctx.textBaseline = "middle";
        ctx.fillText(name, 20, 100);

        const dataUrl = canvas.toDataURL("image/png");
        onSave(dataUrl);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div>
                        <h3 className="text-base font-semibold text-gray-900">Create Your Signature</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Type your name and pick a style</p>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                        <Icon.Close />
                    </button>
                </div>

                <div className="px-5 pt-4">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Type your full name"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                </div>

                <div className="px-5 pt-4">
                    <div className="border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex items-center justify-center" style={{ height: 120 }}>
            <span style={{ fontFamily: fonts[fontIndex].style, fontSize: 40, color: "#1a1a2e" }}>
              {name || "Your signature"}
            </span>
                    </div>
                </div>

                <div className="px-5 pt-4 flex gap-2">
                    {fonts.map((f, i) => (
                        <button
                            key={i}
                            onClick={() => setFontIndex(i)}
                            className={fontIndex === i ? "flex-1 py-2 rounded-lg text-xs font-medium border-2 border-indigo-400 bg-indigo-50 text-indigo-700" : "flex-1 py-2 rounded-lg text-xs font-medium border border-gray-200 text-gray-500 hover:bg-gray-50"}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                <div className="px-5 pb-5 pt-5 flex gap-3">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={save}
                        disabled={!name.trim()}
                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2"
                        style={{ background: !name.trim() ? "#d1d5db" : "linear-gradient(135deg, #6366f1, #4f46e5)", cursor: !name.trim() ? "not-allowed" : "pointer" }}
                    >
                        <Icon.Check /> Apply Signature
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main PDF Preview Component ───────────────────────────────────────────────
export default function PDFPreview() {
    const [pdfFile, setPdfFile] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [showSigCanvas, setShowSigCanvas] = useState(false);
    const [signatures, setSignatures] = useState([]); // [{id, dataUrl, x, y, page, w, h}]
    const [draggingSig, setDraggingSig] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [savedSuccess, setSavedSuccess] = useState(false);
    const pageContainerRef = useRef(null);
    const fileInputRef = useRef(null);

    // Handle file upload
    const handleFile = (file) => {
        if (!file || file.type !== "application/pdf") return;
        setPdfFile(file);
        setPdfUrl(URL.createObjectURL(file));
        setCurrentPage(1);
        setSignatures([]);
    };

    const onDrop = (e) => {
        e.preventDefault();
        handleFile(e.dataTransfer.files[0]);
    };

    // Save drawn signature → place on current page
    const handleSignatureSave = (dataUrl) => {
        const newSig = {
            id: Date.now(),
            dataUrl,
            x: 40,
            y: 40,
            page: currentPage,
            w: 220,
            h: 80,
        };
        setSignatures(prev => [...prev, newSig]);
        setShowSigCanvas(false);
    };

    // Drag signature on PDF
    const startDragSig = (e, sig) => {
        e.preventDefault();
        const rect = pageContainerRef.current.getBoundingClientRect();
        setDraggingSig(sig.id);
        setDragOffset({
            x: e.clientX - rect.left - sig.x,
            y: e.clientY - rect.top - sig.y,
        });
    };

    const onMouseMove = useCallback((e) => {
        if (!draggingSig) return;
        const rect = pageContainerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = e.clientX - rect.left - dragOffset.x;
        const y = e.clientY - rect.top - dragOffset.y;
        setSignatures(prev =>
            prev.map(s => s.id === draggingSig ? { ...s, x: Math.max(0, x), y: Math.max(0, y) } : s)
        );
    }, [draggingSig, dragOffset]);

    const onMouseUp = useCallback(() => setDraggingSig(null), []);

    useEffect(() => {
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, [onMouseMove, onMouseUp]);

    const removeSig = (id) => setSignatures(prev => prev.filter(s => s.id !== id));

    // Simulate saving (in real app: POST to /api/signatures)
    const handleSaveSignatures = async () => {
        try {
            const existingPdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            const pages = pdfDoc.getPages();

            for (const sig of signatures) {
                const page = pages[sig.page - 1];
                const { height: pageHeight } = page.getSize();

                const pngImageBytes = await fetch(sig.dataUrl).then(res => res.arrayBuffer());
                const pngImage = await pdfDoc.embedPng(pngImageBytes);

                page.drawImage(pngImage, {
                    x: sig.x,
                    y: pageHeight - sig.y - sig.h,
                    width: sig.w,
                    height: sig.h,
                });
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            const downloadUrl = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = "signed-document.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setSavedSuccess(true);
            setTimeout(() => setSavedSuccess(false), 2500);
        } catch (err) {
            console.error("Failed to save signed PDF:", err);
            alert("Failed to generate signed PDF. Check console for details.");
        }
    };

    const sigsOnPage = signatures.filter(s => s.page === currentPage);

    // ── Upload screen ──────────────────────────────────────────────────────────
    if (!pdfUrl) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-6">
                <div className="w-full max-w-lg">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 mb-4">
                            <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                                <polyline points="14 2 14 8 20 8" fill="none" stroke="white" strokeWidth="2"/>
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Document Signature App</h1>
                        <p className="text-gray-500 text-sm mt-1">Upload a PDF to preview and sign</p>
                    </div>

                    <div
                        className="border-2 border-dashed border-indigo-200 rounded-2xl p-12 text-center cursor-pointer
                       bg-white hover:border-indigo-400 hover:bg-indigo-50/50 transition-all group"
                        onDrop={onDrop}
                        onDragOver={e => e.preventDefault()}
                        onClick={() => fileInputRef.current.click()}
                    >
                        <div className="flex justify-center mb-4 text-indigo-300 group-hover:text-indigo-500 transition-colors">
                            <Icon.Upload />
                        </div>
                        <p className="text-sm font-semibold text-gray-700">Drop your PDF here</p>
                        <p className="text-xs text-gray-400 mt-1">or click to browse</p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={e => handleFile(e.target.files[0])}
                        />
                    </div>

                    <p className="text-center text-xs text-gray-400 mt-4">
                        Supports PDF files · Secure · No file stored in browser
                    </p>
                </div>
            </div>
        );
    }

    // ── Main viewer ────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-slate-100 flex flex-col" style={{ fontFamily: "Inter, sans-serif" }}>

            {/* Top Bar */}
            <header className="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-4 shadow-sm sticky top-0 z-30">
                {/* Doc name */}
                <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
                        <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                            <polyline points="14 2 14 8 20 8" fill="none" stroke="white" strokeWidth="1.5"/>
                        </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-800 truncate max-w-[200px]">
            {pdfFile?.name || "Document.pdf"}
          </span>
                </div>

                {/* Page nav */}
                <div className="flex items-center gap-1 mx-auto">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage <= 1}
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                    >
                        <Icon.ChevLeft />
                    </button>
                    <span className="text-xs font-medium text-gray-600 px-2 min-w-[70px] text-center">
            {currentPage} / {numPages ?? "—"}
          </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(numPages, p + 1))}
                        disabled={currentPage >= numPages}
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                    >
                        <Icon.ChevRight />
                    </button>
                </div>

                {/* Zoom */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setScale(s => Math.max(0.5, +(s - 0.25).toFixed(2)))}
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                    >
                        <Icon.ZoomOut />
                    </button>
                    <span className="text-xs font-medium text-gray-600 w-12 text-center">
            {Math.round(scale * 100)}%
          </span>
                    <button
                        onClick={() => setScale(s => Math.min(2.5, +(s + 0.25).toFixed(2)))}
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                    >
                        <Icon.ZoomIn />
                    </button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-auto">
                    <button
                        onClick={() => setShowSigCanvas(true)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-indigo-600
                       border border-indigo-200 hover:bg-indigo-50 transition-colors"
                    >
                        <Icon.Pen /> Sign
                    </button>
                    <button
                        onClick={handleSaveSignatures}
                        disabled={signatures.length === 0}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
                        style={{
                            background: signatures.length === 0 ? "#d1d5db" : "linear-gradient(135deg, #6366f1, #4f46e5)",
                            cursor: signatures.length === 0 ? "not-allowed" : "pointer",
                        }}
                    >
                        {savedSuccess ? <><Icon.Check /> Saved!</> : "Save & Submit"}
                    </button>
                    <button
                        onClick={() => { setPdfFile(null); setPdfUrl(null); setSignatures([]); }}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                        title="Close document"
                    >
                        <Icon.Close />
                    </button>
                </div>
            </header>

            {/* Signature count badge */}
            {signatures.length > 0 && (
                <div className="bg-indigo-50 border-b border-indigo-100 px-5 py-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <p className="text-xs text-indigo-700 font-medium">
                        {signatures.length} signature{signatures.length > 1 ? "s" : ""} placed
                        {sigsOnPage.length > 0 && (" . " + sigsOnPage.length + " on this page")}
                    </p>
                </div>

            )}

            {/* PDF Viewer */}
            <main className="flex-1 overflow-auto flex justify-center py-8 px-4">
                <div className="relative" ref={pageContainerRef}>
                    <Document
                        file={pdfUrl}
                        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                        loading={
                            <div className="flex flex-col items-center gap-3 py-20">
                                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                                <p className="text-sm text-gray-500">Loading document…</p>
                            </div>
                        }
                        error={
                            <div className="text-center py-20 text-red-500 text-sm">
                                Failed to load PDF. Please try again.
                            </div>
                        }
                    >
                        <Page
                            pageNumber={currentPage}
                            scale={scale}
                            className="shadow-2xl rounded-sm"
                            renderAnnotationLayer={true}
                            renderTextLayer={true}
                        />
                    </Document>

                    {/* Overlay signatures on current page */}
                    {sigsOnPage.map(sig => (
                        <div
                            key={sig.id}
                            style={{
                                position: "absolute",
                                left: sig.x,
                                top: sig.y,
                                width: sig.w,
                                height: sig.h,
                                cursor: draggingSig === sig.id ? "grabbing" : "grab",
                                userSelect: "none",
                                zIndex: 20,
                            }}
                            onMouseDown={e => startDragSig(e, sig)}
                        >
                            <img
                                src={sig.dataUrl}
                                alt="Signature"
                                draggable={false}
                                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                            />
                            {/* Delete button */}
                            <button
                                onMouseDown={e => { e.stopPropagation(); removeSig(sig.id); }}
                                className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-red-500 text-white
                           flex items-center justify-center shadow-sm hover:bg-red-600 transition-colors"
                                style={{ fontSize: 10 }}
                            >
                                ✕
                            </button>
                            {/* Drag hint border */}
                            <div className="absolute inset-0 border-2 border-dashed border-indigo-400 rounded opacity-60 pointer-events-none" />
                        </div>
                    ))}
                </div>
            </main>

            {/* Signature Draw Modal */}
            {showSigCanvas && (
                <SignatureCanvas
                    onSave={handleSignatureSave}
                    onClose={() => setShowSigCanvas(false)}
                />
            )}
        </div>
    );
}