import { useState } from "react";
import Login from "./Login";
import DocumentList from "./DocumentList";
import SignatureOverlay from "./SignatureOverlay";
import PDFPreview from "./PDFPreview";

function App() {
    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));

    const handleLogout = () => {
        console.log("Logout clicked");
        localStorage.removeItem("token");
        setLoggedIn(false);
        console.log("loggedIn should now be false");
    };
    if (!loggedIn) {
        return <Login onLogin={() => setLoggedIn(true)} />;
    }

    return (
        <div>
            <DocumentList onLogout={handleLogout} />
            <PDFPreview />
        </div>
    );
}

export default App;