"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showLogout, setShowLogout] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(firebaseAuth);
            router.push("/");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const getInitials = (name) => {
        if (!name) return "U";
        const parts = name.split(" ");
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name[0].toUpperCase();
    };

    return (
        <nav className="flex items-center justify-between p-4 h-25 text-white border-b-2 border-gray-300">
            <div className="flex items-center ml-10">
                <Image
                    src="/images/logo.svg"
                    alt="Logo"
                    width={40}
                    height={40}
                    className="rounded-full"
                />
                <Link href="/">
                    <span className="ml-4 font-bold text-md">/ support@aanya.io</span>
                </Link>
            </div>
            <div className="flex space-x-16 text-lg font-medium">
                <Link href="/" className="hover:text-gray-400">
                    Home
                </Link>
                <Link href="/events" className="hover:text-gray-400">
                    Events
                </Link>
                <Link href="/contact" className="hover:text-gray-400">
                    Contact
                </Link>
            </div>
            <div className="flex items-center mr-10 gap-8">
                {loading ? (
                    <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse"></div>
                ) : user ? (
                    <div
                        className="relative"
                        onMouseEnter={() => setShowLogout(true)}
                        onMouseLeave={() => setShowLogout(false)}
                    >
                        <div
                            onClick={handleLogout}
                            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                        >
                            <span className="text-white font-semibold">{user.displayName || "User"}</span>
                            {user.photoURL ? (
                                <Image
                                    src={user.photoURL}
                                    alt="Profile"
                                    width={40}
                                    height={40}
                                    className="rounded-full border-2 border-white"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-linear-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-lg border-2 border-white">
                                    {getInitials(user.displayName || user.email)}
                                </div>
                            )}
                        </div>
                        {showLogout && (
                            <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border-2 border-gray-200 py-2 px-4 z-50">
                                <button
                                    onClick={handleLogout}
                                    className="text-red-600 font-semibold hover:text-red-800 transition-colors w-full text-left cursor-pointer"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <Link href="/login">
                            <button className="text-white font-semibold cursor-pointer hover:text-gray-400">
                                Login
                            </button>
                        </Link>
                        <Link href="/sign-up">
                            <button className=" hover:bg-white hover:text-black text-white border border-white font-semibold py-2 px-6 rounded-full cursor-pointer">
                                Sign Up
                            </button>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}
