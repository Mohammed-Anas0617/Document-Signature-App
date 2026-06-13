import { useState, useEffect } from "react";

export default function DocumentList() {
    const [documents, setDocuments] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetch("http://localhost:8080/document", {
            headers: {Authorization: "Bearer " + token},
        })
            .then((res) => res.json())
            .then((data) => setDocuments(data));
    }, []);

    return (
        <div style={{padding: "20px"}}>
            <h1>My Documents</h1>
            <ul>
                {documents.map((doc) => (
                    <li key={doc.id}>
                        {doc.fileName}
                    </li>
                ))}
            </ul>
        </div>
    );
}