"use client";
import Image from "next/image";
import Navbar from "@/components/navbar";
import eventData from "@/data/events.json";
import { useState, use, useEffect } from "react";
import { firebaseAuth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { addEventTicket, updateUserProfile, getUserDocument } from "@/lib/firestore";
import { useRouter } from "next/navigation";
import { generateTicketPDF } from "@/lib/ticketGenerator";

export default function EventPage({ params }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const event = eventData.find((event) => event.id === parseInt(resolvedParams.id));

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [bookingCompleted, setBookingCompleted] = useState(false);
    const [ticketId, setTicketId] = useState("");
    const [initialUserData, setInitialUserData] = useState(null);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        age: "",
        gender: "",
        email: "",
        phone: "",
        tshirtSize: "M"
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);

                // Fetch user data from Firestore and pre-fill the form
                const userData = await getUserDocument(currentUser.uid);
                if (userData.success && userData.data) {
                    setInitialUserData({
                        firstName: userData.data.firstName || "",
                        lastName: userData.data.lastName || ""
                    });

                    setFormData(prev => ({
                        ...prev,
                        firstName: userData.data.firstName || "",
                        lastName: userData.data.lastName || "",
                        age: userData.data.age || "",
                        gender: userData.data.gender || "",
                        email: currentUser.email || "",
                        phone: userData.data.phone || "",
                        tshirtSize: userData.data.tshirtSize || "M"
                    }));
                } else {
                    // If no user data exists, just set email
                    setFormData(prev => ({
                        ...prev,
                        email: currentUser.email || ""
                    }));
                }
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setError("Please login to book a ticket");
            setTimeout(() => router.push("/login"), 2000);
            return;
        }

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            // Check if firstName or lastName changed and update if necessary
            const nameChanged = initialUserData &&
                (formData.firstName !== initialUserData.firstName ||
                    formData.lastName !== initialUserData.lastName);

            // Update user profile with booking information
            await updateUserProfile(user.uid, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                age: parseInt(formData.age),
                gender: formData.gender,
                phone: formData.phone,
                tshirtSize: formData.tshirtSize
            });

            // Add event ticket to user's tickets array
            const result = await addEventTicket(user.uid, {
                eventId: event.id,
                eventTitle: event.title,
                eventDate: event.date,
                eventLocation: event.location,
                firstName: formData.firstName,
                lastName: formData.lastName,
                age: parseInt(formData.age),
                gender: formData.gender,
                email: formData.email,
                phone: formData.phone,
                tshirtSize: formData.tshirtSize,
                price: event.price
            });

            if (result.success) {
                // Generate PDF ticket
                const ticketData = {
                    ...result.ticket,
                    eventDate: event.date,
                    eventLocation: event.location,
                    bookingDate: new Date(result.ticket.bookingDate).toLocaleString()
                };

                const pdfBlob = generateTicketPDF(ticketData);

                // Convert blob to base64 for email attachment
                const reader = new FileReader();
                reader.readAsDataURL(pdfBlob);
                reader.onloadend = async () => {
                    const base64data = reader.result.split(',')[1];

                    // Send ticket email
                    try {
                        const emailResponse = await fetch('/api/send-ticket', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                to: formData.email,
                                ticketData: ticketData,
                                pdfBase64: base64data
                            })
                        });

                        const emailResult = await emailResponse.json();

                        if (emailResult.success) {
                            setSuccess(`🎉 Ticket booked successfully! Confirmation email sent to ${formData.email}`);
                            setBookingCompleted(true);
                            setTicketId(result.ticketId);
                        } else {
                            setSuccess(`✓ Ticket booked successfully! Ticket ID: ${result.ticketId}`);
                            setError(`Note: Confirmation email could not be sent. Please save your Ticket ID: ${result.ticketId}`);
                            setBookingCompleted(true);
                            setTicketId(result.ticketId);
                        }
                    } catch (emailError) {
                        console.error("Email error:", emailError);
                        setSuccess(`✓ Ticket booked successfully! Ticket ID: ${result.ticketId}`);
                        setError(`Note: Confirmation email could not be sent. Please save your Ticket ID: ${result.ticketId}`);
                        setBookingCompleted(true);
                        setTicketId(result.ticketId);
                    }
                };
            } else {
                setError(result.error || "Failed to book ticket");
            }
        } catch (err) {
            setError(err.message || "An error occurred while booking");
        } finally {
            setLoading(false);
        }
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
                                <h1 className="text-4xl font-bold mb-6">{bookingCompleted ? "Booking Confirmed" : "Book Your Ticket"}</h1>
                                {!user && !bookingCompleted && (
                                    <div className="p-4 mb-4 bg-yellow-100 border-2 border-yellow-500 rounded-full text-yellow-700 text-center">
                                        Please <a href="/login" className="font-bold underline">login</a> to book tickets
                                    </div>
                                )}
                                {error && (
                                    <div className="p-4 mb-4 bg-red-100 border-2 border-red-500 rounded-full text-red-700 text-center">
                                        {error}
                                    </div>
                                )}
                                {success && (
                                    <div className="p-4 mb-4 bg-green-100 border-2 border-green-500 rounded-full text-green-700 text-center text-xl">
                                        {success}
                                    </div>
                                )}

                                {bookingCompleted ? (
                                    <div className="glassmorphism p-8 rounded-2xl max-w-2xl mx-auto w-full">
                                        <div className="text-center mb-6">
                                            <div className="text-6xl mb-4">🎉</div>
                                            <h2 className="text-3xl font-bold text-white mb-2">Thank You!</h2>
                                            <p className="text-xl text-white">Your ticket has been confirmed</p>
                                        </div>

                                        <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 mb-6">
                                            <p className="text-black text-lg mb-1"><strong>Ticket ID:</strong></p>
                                            <p className="text-xl font-mono font-bold text-green-400 break-all">{ticketId}</p>
                                        </div>

                                        <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 mb-6">
                                            <h3 className="text-xl font-bold text-black mb-2">Important Information</h3>
                                            <ul className="text-black space-y-2">
                                                <li>✓ Payment Status: <strong className="text-green-400">CONFIRMED</strong></li>
                                                <li>✓ Please save your Ticket ID for future reference</li>
                                                <li>✓ Present this ticket at the event entrance</li>
                                                {error && <li>⚠️ Check your spam folder for confirmation email</li>}
                                            </ul>
                                        </div>

                                        <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4">
                                            <h3 className="text-xl font-bold text-black mb-2">Need Help?</h3>
                                            <p className="text-black mb-2">For any queries or issues, please contact us:</p>
                                            <div className="space-y-2 text-black">
                                                <p>📧 Email: <a href="mailto:support@aanya.io" className="text-green-400 hover:underline font-semibold">support@aanya.io</a></p>
                                                <p>📞 Phone: <a href="tel:+919876543210" className="text-green-400 hover:underline font-semibold">+91 88888 88888</a></p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => router.push('/events')}
                                            className="w-full mt-6 bg-black text-white px-8 py-4 rounded-full text-xl font-semibold hover:bg-green-700 transition-colors cursor-pointer"
                                        >
                                            Browse More Events
                                        </button>
                                    </div>
                                ) : (
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
                                                    disabled={loading || !user}
                                                    className="bg-black text-white px-12 py-4 rounded-full text-xl font-semibold hover:bg-green-700 transition-colors cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                                                >
                                                    {loading ? "Booking..." : "Confirm Booking"}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}
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
