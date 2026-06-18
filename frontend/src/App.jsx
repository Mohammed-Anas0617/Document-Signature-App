import { useState } from "react";
import Login from "./Login";
import DocumentList from "./DocumentList";
import SignatureOverlay from "./SignatureOverlay";
import PDFPreview from "./PDFPreview";

function App() {
    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));

    if (!loggedIn) {
        return <Login onLogin={() => setLoggedIn(true)} />;
    }

    return (
        <div>
            <DocumentList />
            <PDFPreview />
        </div>
    );
}

export default App;