"use client";
import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";
import { createUserDocument } from "@/lib/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/navbar";

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleGoogleSignIn = async () => {
        setError("");
        setLoading(true);

        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(firebaseAuth, provider);

            // Create user document if it doesn't exist
            const nameParts = result.user.displayName?.split(" ") || ["", ""];
            await createUserDocument(result.user.uid, {
                firstName: nameParts[0],
                lastName: nameParts.slice(1).join(" "),
                email: result.user.email
            });

            router.push("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await signInWithEmailAndPassword(
                firebaseAuth,
                formData.email,
                formData.password
            );
            router.push("/");
        } catch (err) {
            setError("Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex w-screen min-h-screen items-center justify-center px-10 py-10">
                <div className="flex flex-col w-full max-w-md gap-8">
                    <div className="flex flex-col gap-2 text-center">
                        <h1 className="text-4xl font-bold">Login</h1>
                        <p className="text-xl text-gray-600">Welcome back! Please login to your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6 glassmorphism p-8 rounded-3xl">
                        {error && (
                            <div className="p-4 bg-red-100 border-2 border-red-500 rounded-full text-red-700 text-center">
                                {error}
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            <label className="text-white text-lg font-semibold">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="px-4 py-3 rounded-full border-2 border-black bg-white text-black text-lg focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-white text-lg font-semibold">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="px-4 py-3 rounded-full border-2 border-black bg-white text-black text-lg focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="Enter your password"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-5 h-5 cursor-pointer" />
                                <span className="text-lg text-gray-600">Remember me</span>
                            </label>
                            <Link href="/forgot-password" className="text-lg text-white font-semibold hover:underline">
                                Forgot Password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-black text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>

                        <div className="flex items-center gap-4">
                            <div className="flex-1 h-px bg-gray-300"></div>
                            <span className="text-gray-600 text-lg">OR</span>
                            <div className="flex-1 h-px bg-gray-300"></div>
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                            className="flex items-center justify-center gap-3 bg-white border-2 border-black text-black px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed"
                        >
                            <svg className="w-6 h-6" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            {loading ? "Signing in..." : "Continue with Google"}
                        </button>

                        <p className="text-center text-lg text-gray-600">
                            Don't have an account?{" "}
                            <Link href="/sign-up" className="text-white font-bold hover:underline">
                                Sign Up
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}
