"use client";
import Image from "next/image";
import Navbar from "@/components/navbar";
import eventData from "@/data/events.json";
import { useState, use } from "react";

export default function EventPage({ params }) {
    const resolvedParams = use(params);
    const event = eventData.find((event) => event.id === parseInt(resolvedParams.id));

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        age: "",
        gender: "",
        email: "",
        phone: "",
        tshirtSize: "M"
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Ticket confirmed for ${formData.firstName} ${formData.lastName}!\nTotal: ₹${event.price}`);
    };

    return (
        <>
            <Navbar />
            <div className="flex w-screen min-h-screen p-4 flex-col items-center gap-10">
                {event ? (
                    <>
                        <div className="flex gap-6 h-fit p-4 glassmorphism w-full">
                            <Image
                                src={event.imageUrl}
                                alt={event.title}
                                width={600}
                                height={400}
                                className="rounded-2xl flex-1"
                            />
                            <div className="flex flex-col gap-4 flex-1">
                                <h1 className="text-6xl font-bold">{event.title}</h1>
                                <p className="text-xl">{event.description}</p>
                                <p className="text-xl">Date: {event.date}</p>
                                <p className="text-xl">Location: {event.location}</p>
                                <p className="text-xl">Price: ₹{event.price}</p>
                                <p className="text-xl">Status: {event.status.charAt(0).toUpperCase() + event.status.slice(1)}</p>
                            </div>
                        </div>

                        {event.status === "live" && (
                            <div className="flex flex-col w-full h-fit">
                                <h1 className="text-4xl font-bold mb-6">Book Your Ticket</h1>
                                <div className="flex gap-6">
                                    <Image
                                        src='/images/book-tickets.jpg'
                                        alt={event.title}
                                        width={515}
                                        height={400}
                                        className="rounded-2xl mb-6"
                                    />
                                    <form onSubmit={handleSubmit} className="flex flex-col gap-6 glassmorphism p-6 rounded-2xl flex-1 h-fit">
                                        <div className="flex gap-4">
                                            <div className="flex flex-col gap-2 flex-1">
                                                <label className="text-white text-xl font-semibold">First Name</label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                    required
                                                    className="px-4 py-3 rounded-full border-2 border-black bg-white text-black text-lg focus:outline-none focus:ring-2 focus:ring-black"
                                                    placeholder="Enter first name"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2 flex-1">
                                                <label className="text-white text-xl font-semibold">Last Name</label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleChange}
                                                    required
                                                    className="px-4 py-3 rounded-full border-2 border-black bg-white text-black text-lg focus:outline-none focus:ring-2 focus:ring-black"
                                                    placeholder="Enter last name"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <div className="flex flex-col gap-2 flex-1">
                                                <label className="text-white text-xl font-semibold">Age</label>
                                                <input
                                                    type="number"
                                                    name="age"
                                                    value={formData.age}
                                                    onChange={handleChange}
                                                    required
                                                    min="1"
                                                    max="120"
                                                    className="px-4 py-3 rounded-full border-2 border-black bg-white text-black text-lg focus:outline-none focus:ring-2 focus:ring-black"
                                                    placeholder="Enter your age"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2 flex-1">
                                                <label className="text-white text-xl font-semibold">Gender</label>
                                                <select
                                                    name="gender"
                                                    value={formData.gender}
                                                    onChange={handleChange}
                                                    required
                                                    className="px-4 py-3 rounded-full border-2 border-black bg-white text-black text-lg focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
                                                >
                                                    <option value="">Select gender</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <div className="flex flex-col gap-2 flex-1">
                                                <label className="text-white text-xl font-semibold">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    required
                                                    className="px-4 py-3 rounded-full border-2 border-black bg-white text-black text-lg focus:outline-none focus:ring-2 focus:ring-black"
                                                    placeholder="Enter your phone number"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2 flex-1">
                                                <label className="text-white text-xl font-semibold">T-Shirt Size</label>
                                                <select
                                                    name="tshirtSize"
                                                    value={formData.tshirtSize}
                                                    onChange={handleChange}
                                                    required
                                                    className="px-4 py-3 rounded-full border-2 border-black bg-white text-black text-lg focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
                                                >
                                                    <option value="XS">XS</option>
                                                    <option value="S">S</option>
                                                    <option value="M">M</option>
                                                    <option value="L">L</option>
                                                    <option value="XL">XL</option>
                                                    <option value="XXL">XXL</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <label className="text-white text-xl font-semibold">Email</label>
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

                                        <div className="flex items-center justify-between pt-4 border-t border-black border-opacity-20">
                                            <div className="text-white">
                                                <p className="text-2xl font-bold">Total Amount</p>
                                                <p className="text-3xl font-bold">₹{event.price}</p>
                                            </div>
                                            <button
                                                type="submit"
                                                className="bg-black text-white px-12 py-4 rounded-full text-xl font-semibold hover:bg-green-700 transition-colors cursor-pointer"
                                            >
                                                Confirm Booking
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-2xl">Event not found.</p>
                )}
            </div>
        </>
    );
}
