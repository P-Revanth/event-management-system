import { doc, setDoc, getDoc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import { firebaseDB } from "./firebase";

/**
 * Create or update user document in Firestore
 * @param {string} userId - The user's UID
 * @param {object} userData - User data to store
 */
export const createUserDocument = async (userId, userData) => {
    try {
        const userRef = doc(firebaseDB, "users", userId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            // Create new user document
            await setDoc(userRef, {
                firstName: userData.firstName || "",
                lastName: userData.lastName || "",
                email: userData.email || "",
                age: userData.age || null,
                gender: userData.gender || "",
                phone: userData.phone || "",
                tshirtSize: userData.tshirtSize || "",
                eventTickets: [],
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
        }
        return { success: true };
    } catch (error) {
        console.error("Error creating user document:", error);
        return { success: false, error: error.message };
    }
};

/**
 * Update user profile information
 * @param {string} userId - The user's UID
 * @param {object} profileData - Profile data to update
 */
export const updateUserProfile = async (userId, profileData) => {
    try {
        const userRef = doc(firebaseDB, "users", userId);
        await updateDoc(userRef, {
            ...profileData,
            updatedAt: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        console.error("Error updating user profile:", error);
        return { success: false, error: error.message };
    }
};

/**
 * Get user document from Firestore
 * @param {string} userId - The user's UID
 */
export const getUserDocument = async (userId) => {
    try {
        const userRef = doc(firebaseDB, "users", userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            return { success: true, data: userDoc.data() };
        } else {
            return { success: false, error: "User document not found" };
        }
    } catch (error) {
        console.error("Error getting user document:", error);
        return { success: false, error: error.message };
    }
};

/**
 * Add event ticket to user's tickets array
 * @param {string} userId - The user's UID
 * @param {object} ticketData - Ticket information
 */
export const addEventTicket = async (userId, ticketData) => {
    try {
        const userRef = doc(firebaseDB, "users", userId);

        const ticket = {
            ticketId: `TICKET-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            eventId: ticketData.eventId,
            eventTitle: ticketData.eventTitle,
            firstName: ticketData.firstName,
            lastName: ticketData.lastName,
            age: ticketData.age,
            gender: ticketData.gender,
            email: ticketData.email,
            phone: ticketData.phone,
            tshirtSize: ticketData.tshirtSize,
            price: ticketData.price,
            paymentStatus: "pending", // pending, completed, failed
            bookingDate: serverTimestamp()
        };

        await updateDoc(userRef, {
            eventTickets: arrayUnion(ticket),
            updatedAt: serverTimestamp()
        });

        return { success: true, ticketId: ticket.ticketId };
    } catch (error) {
        console.error("Error adding event ticket:", error);
        return { success: false, error: error.message };
    }
};

/**
 * Update payment status for a specific ticket
 * @param {string} userId - The user's UID
 * @param {string} ticketId - The ticket ID
 * @param {string} status - Payment status (pending, completed, failed)
 */
export const updateTicketPaymentStatus = async (userId, ticketId, status) => {
    try {
        const userRef = doc(firebaseDB, "users", userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            const updatedTickets = userData.eventTickets.map(ticket =>
                ticket.ticketId === ticketId
                    ? { ...ticket, paymentStatus: status }
                    : ticket
            );

            await updateDoc(userRef, {
                eventTickets: updatedTickets,
                updatedAt: serverTimestamp()
            });

            return { success: true };
        }

        return { success: false, error: "User not found" };
    } catch (error) {
        console.error("Error updating payment status:", error);
        return { success: false, error: error.message };
    }
};
