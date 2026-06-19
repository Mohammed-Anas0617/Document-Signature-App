import { useState, useEffect } from "react";

export default function SignatureOverlay({ docId }) {
    const [signatures, setSignatures] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetch(`https://signature-app-backend-b82o.onrender.com/signature/${docId}`, {
            headers: {Authorization: "Bearer " + token},
        })
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) setSignatures(data);
            });
    }, [docId]);

    const handleClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        fetch("https://signature-app-backend-b82o.onrender.com/signature", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({docId, signerId: 1, x, y, page: 1}),
        })
            .then((res) => res.json())
            .then((newSig) => setSignatures((prev) => [...prev, newSig]));
    };

    return (
        <div
            onClick={handleClick}
            style={{
                position: "relative", width: "600px", height: "800px",
                border: "1px solid #ccc", cursor: "crosshair", background: "#f9f9f9",
                margin: "20px" }}
        >
            <p style={{textAlign: "center", color: "#999"}}>Click to place signature</p>
            {signatures.map((sig) => (
                <div key={sig.id} style={{
                    position: "absolute", left: sig.x, top: sig.y,
                    background: "rgba(255,165,0,0.5)", border: "2px dashed orange",
                    padding: "4px 8px", fontSize: "12px", cursor: "default"
                }}>
                    Sign here
                </div>
            ))}
        </div>
    );
}
