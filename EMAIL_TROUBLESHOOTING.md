# Email Not Working? Here's Why and How to Fix It

## The Problem

Your GITAM email (`hyeruban@gitam.in`) likely has restrictions that prevent it from being used with external applications. Educational institution emails often have stricter security policies.

## Quick Solutions (Choose One)

### ✅ **Option 1: Use a Personal Gmail Account (RECOMMENDED)**

1. **Create or use a personal Gmail account** (e.g., `yourname@gmail.com`)

2. **Enable 2-Step Verification:**
   - Go to: https://myaccount.google.com/security
   - Click "2-Step Verification" → Enable it

3. **Create App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it: "Event Tickets"
   - Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

4. **Update `.env.local`:**
   ```env
   EMAIL_USER=yourname@gmail.com
   EMAIL_PASSWORD=abcdefghijklmnop
   ```
   (Remove spaces from the App Password)

5. **Restart server:**
   ```bash
   # Press Ctrl+C, then:
   npm run dev
   ```

### ✅ **Option 2: Use Ethereal Email (For Testing)**

This creates a fake inbox for testing - no real emails sent but you can see them in a web interface.

1. **Update `/src/app/api/send-ticket/route.js`:**

   Replace the transporter creation with:
   ```javascript
   // For testing only - creates fake inbox
   const testAccount = await nodemailer.createTestAccount();
   
   const transporter = nodemailer.createTransporter({
       host: 'smtp.ethereal.email',
       port: 587,
       secure: false,
       auth: {
           user: testAccount.user,
           pass: testAccount.pass
       }
   });
   ```

2. **After sending, check console for preview URL**

### ✅ **Option 3: Skip Email for Now**

The system works perfectly without email! Just comment out email in `.env.local`:
```env
# EMAIL_USER=hyeruban@gitam.in
# EMAIL_PASSWORD=your-password
```

Users will still:
- ✅ Get tickets in Firestore
- ✅ See Ticket ID on screen
- ✅ See payment confirmation
- ✅ Get all booking details

## Why GITAM Email Won't Work

Educational emails like `@gitam.in` typically:
- Block external SMTP access
- Require special configurations
- Have strict security policies
- Don't support App Passwords

## Current Error Logs

Check your terminal for error messages like:
- `Invalid login` - Wrong credentials or no App Password
- `Connection timeout` - SMTP blocked
- `Authentication failed` - Need App Password instead of regular password

## Test If Email Works

After configuration, check terminal logs:
- ✅ `SMTP connection verified` = Email will work
- ❌ `SMTP verification failed` = Check credentials

## Production Alternative

For production, use a service like:
- **SendGrid** (100 emails/day free)
- **AWS SES** (Very cheap)
- **Mailgun** (Good for high volume)

These are more reliable than Gmail for production apps.

## Bottom Line

**Use a personal Gmail with App Password** - it's the easiest and most reliable solution for testing!
