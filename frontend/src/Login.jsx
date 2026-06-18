import { useState } from "react";

export default function Login({ onLogin }) {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        const url = isRegister
            ? "http://localhost:8080/auth/register"
            : "http://localhost:8080/auth/login";

        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.text();

        if (res.ok && !isRegister) {
            localStorage.setItem("token", data);
            onLogin();
        } else if (res.ok && isRegister) {
            setIsRegister(false);
            setError("Registered! Please login.");
        } else {
            setError("Something went wrong. Try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-indigo-800 mb-2">📄 Document Signature App</h1>
                <p className="text-gray-400 mb-6 text-sm">
                    {isRegister ? "Create a new account" : "Sign in to your account"}
                </p>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <div className="mb-4">
                    <label className="text-sm text-gray-600 font-medium">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                           className="w-full border border-gray-200 rounded-lg px-4 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                           placeholder="anas@example.com" />
                </div>

                <div className="mb-6">
                    <label className="text-sm text-gray-600 font-medium">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                           className="w-full border border-gray-200 rounded-lg px-4 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                           placeholder="••••••••" />
                </div>

                <button onClick={handleSubmit}
                        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-all">
                    {isRegister ? "Register" : "Login"}
                </button>

                <p className="text-center text-sm text-gray-400 mt-4">
                    {isRegister ? "Already have an account?" : "Don't have an account?"}
                    <button onClick={() => { setIsRegister(!isRegister); setError(""); }}
                            className="text-indigo-600 font-medium ml-1 hover:underline">
                        {isRegister ? "Login" : "Register"}
                    </button>
                </p>
            </div>
        </div>
    );
}