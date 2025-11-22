# Email Configuration Setup Guide

## Setting up Gmail for Sending Tickets

To enable ticket emails, you need to configure a Gmail account with an App Password.

### Steps:

1. **Go to your Google Account Settings**
   - Visit https://myaccount.google.com/

2. **Enable 2-Step Verification**
   - Go to Security > 2-Step Verification
   - Follow the steps to enable it if not already enabled

3. **Generate App Password**
   - Go to Security > 2-Step Verification > App passwords
   - Select "Mail" and "Other (Custom name)"
   - Name it "Event Management System"
   - Click "Generate"
   - Copy the 16-character password

4. **Add to .env.local**
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   ```

5. **Restart Development Server**
   ```bash
   npm run dev
   ```

## Alternative Email Providers

### Using SendGrid (Recommended for Production)
```javascript
// In /src/app/api/send-ticket/route.js
const transporter = nodemailer.createTransporter({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
    }
});
```

### Using Outlook/Hotmail
```javascript
const transporter = nodemailer.createTransporter({
    service: 'hotmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});
```

### Using Custom SMTP Server
```javascript
const transporter = nodemailer.createTransporter({
    host: 'smtp.your-domain.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});
```

## Testing Email Functionality

1. Complete the email configuration
2. Restart the dev server
3. Login to your account
4. Book a ticket for an event
5. Check your email inbox for the confirmation

## Troubleshooting

### "Invalid login" error
- Make sure you're using an App Password, not your regular Gmail password
- Verify 2-Step Verification is enabled on your Google account

### Email not received
- Check spam folder
- Verify EMAIL_USER and EMAIL_PASSWORD are correct in .env.local
- Check server logs for error messages

### "Connection timeout" error
- Check your internet connection
- Some ISPs block SMTP ports - try using port 587 instead of 465
- Try a different email provider

## Production Recommendations

For production deployments:
1. Use SendGrid, AWS SES, or similar professional email service
2. Set up proper email authentication (SPF, DKIM, DMARC)
3. Use environment variables in your hosting platform
4. Monitor email sending logs and delivery rates
5. Implement rate limiting to prevent abuse
