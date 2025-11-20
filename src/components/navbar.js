import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
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
                <Link href="/login">
                    <button className="text-white font-semibold cursor-pointer hover:text-gray-400">
                        Login
                    </button>
                </Link>
                <Link href="/signup">
                    <button className=" hover:bg-white hover:text-black text-white border border-white font-semibold py-2 px-6 rounded-full cursor-pointer">
                        Sign Up
                    </button>
                </Link>
            </div>
        </nav>
    );
}
