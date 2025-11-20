# Firestore Database Setup

## Overview
This application uses Firebase Firestore to store user data and event ticket bookings.

## Database Structure

### Users Collection (`users`)
Each document in the `users` collection represents a user and contains:

```javascript
{
  // User Profile Information
  firstName: string,           // User's first name
  lastName: string,            // User's last name
  email: string,               // User's email address
  age: number | null,          // User's age (null until first booking)
  gender: string,              // User's gender (empty until first booking)
  phone: string,               // User's phone number (empty until first booking)
  tshirtSize: string,          // User's t-shirt size (empty until first booking)
  
  // Event Tickets Array
  eventTickets: [
    {
      ticketId: string,        // Unique ticket ID (e.g., "TICKET-1234567890-abc123")
      eventId: number,         // ID of the event
      eventTitle: string,      // Title of the event
      firstName: string,       // Name on the ticket (can differ from profile)
      lastName: string,
      age: number,
      gender: string,
      email: string,
      phone: string,
      tshirtSize: string,
      price: number,           // Ticket price in INR
      paymentStatus: string,   // "pending" | "completed" | "failed"
      bookingDate: timestamp   // Server timestamp of booking
    }
  ],
  
  // Metadata
  createdAt: timestamp,        // Account creation timestamp
  updatedAt: timestamp         // Last update timestamp
}
```

## Firestore Setup Instructions

### 1. Enable Firestore in Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click on "Firestore Database" in the left sidebar
4. Click "Create Database"
5. Choose "Start in production mode" or "Start in test mode"
   - **Production mode**: More secure, requires security rules
   - **Test mode**: Open access for 30 days (useful for development)
6. Select a Cloud Firestore location (choose closest to your users)
7. Click "Enable"

### 2. Set Security Rules

For **Development/Testing**, use these rules (expires after 30 days):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 12, 31);
    }
  }
}
```

For **Production**, use these secure rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      // Allow users to read their own document
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Allow users to create their own document
      allow create: if request.auth != null && request.auth.uid == userId;
      
      // Allow users to update their own document
      allow update: if request.auth != null && request.auth.uid == userId;
      
      // Don't allow deletion
      allow delete: if false;
    }
  }
}
```

### 3. Verify Firebase Configuration

Make sure your `.env.local` file contains all Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

## Features Implemented

### 1. User Document Creation
- Automatically creates a user document when signing up with email/password
- Creates a user document when signing in with Google (if it doesn't exist)
- Initial document only contains basic profile info (firstName, lastName, email)

### 2. Profile Updates
- User profile is updated with booking information when they make their first ticket purchase
- Fields like age, gender, phone, and tshirtSize are populated from the booking form

### 3. Ticket Booking
- Each ticket booking creates a new entry in the user's `eventTickets` array
- Generates a unique ticket ID for each booking
- Records all booking details including event info and payment status
- Payment status defaults to "pending" (ready for Razorpay integration)

### 4. Authentication Integration
- Booking form pre-fills email from authenticated user
- Users must be logged in to book tickets
- Form validation ensures all required fields are filled

## API Functions

All Firestore operations are in `/src/lib/firestore.js`:

- **`createUserDocument(userId, userData)`**: Creates or checks for existing user document
- **`updateUserProfile(userId, profileData)`**: Updates user profile information
- **`getUserDocument(userId)`**: Retrieves user document data
- **`addEventTicket(userId, ticketData)`**: Adds a ticket to user's eventTickets array
- **`updateTicketPaymentStatus(userId, ticketId, status)`**: Updates payment status for a specific ticket

## Error Handling

All functions return a standardized response:
```javascript
{
  success: boolean,
  data?: any,        // Present on successful reads
  error?: string,    // Present on failures
  ticketId?: string  // Present on successful ticket creation
}
```

## Next Steps

### Payment Integration (Razorpay)
After a successful payment:
```javascript
import { updateTicketPaymentStatus } from "@/lib/firestore";

// Update payment status to "completed"
await updateTicketPaymentStatus(userId, ticketId, "completed");
```

### User Dashboard
Create a dashboard to display:
- User profile information
- List of booked tickets
- Payment status for each ticket
- Download ticket functionality

### Admin Panel
- View all bookings
- Filter by event, payment status, date
- Export booking data
- Mark payments as completed/failed

## Testing

1. Sign up with a new account
2. Navigate to a live event
3. Fill out the booking form
4. Submit the booking
5. Check Firestore Console to verify:
   - User document exists in `users` collection
   - `eventTickets` array contains the booking
   - All fields are properly populated
   - Payment status is "pending"

## Troubleshooting

### "Permission Denied" Errors
- Check Firestore security rules
- Ensure user is authenticated
- Verify userId matches the authenticated user

### "Document Not Found" Errors
- User document may not have been created
- Check that `createUserDocument` was called during sign-up

### "Field Missing" Errors
- Ensure all required fields are passed to functions
- Check form validation is working correctly
