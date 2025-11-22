// app/api/send-ticket/route.js  (Next.js App Router example)
import { NextResponse } from "next/server";

export async function POST(request) {
    console.log('\n🔍 ========== EMAIL SENDING ATTEMPT ==========');
    console.log('Timestamp:', new Date().toISOString());

    try {
        // Dynamic import (works in Next.js server runtime)
        const nodemailerModule = await import('nodemailer');
        const nodemailer = nodemailerModule; // nodemailer.createTransport exists on the module

        const { to, ticketData, pdfBase64 } = await request.json();

        console.log('📬 Recipient:', to);
        console.log('🎫 Ticket ID:', ticketData?.ticketId);

        // Validate env
        const EMAIL_USER = process.env.EMAIL_USER;
        const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
        console.log('\n🔐 Checking credentials...');
        console.log('EMAIL_USER exists:', !!EMAIL_USER);
        // don't print password value in production
        console.log('EMAIL_PASSWORD exists:', !!EMAIL_PASSWORD);
        console.log('EMAIL_PASSWORD length:', EMAIL_PASSWORD?.length);

        if (!EMAIL_USER || !EMAIL_PASSWORD) {
            console.error('❌ Email credentials not configured');
            console.log('========================================\n');
            return NextResponse.json({
                success: false,
                error: 'Email service not configured. Please contact support for your ticket.'
            }, { status: 500 });
        }

        console.log('\n📧 Creating SMTP transporter...');

        // For Gmail you can use service: 'gmail' OR host/port config
        // Using explicit host/port so you can replace with any provider easily.
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // TLS is used with port 587 via STARTTLS
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASSWORD
            },
            tls: {
                // allow self-signed certs (dev only). Not recommended for prod.
                rejectUnauthorized: false
            }
        });

        // Verify transporter configuration
        console.log('\n🔌 Verifying SMTP connection...');
        try {
            await transporter.verify();
            console.log('✅ SMTP connection verified successfully!');
        } catch (verifyError) {
            console.error('\n❌ SMTP VERIFICATION FAILED:');
            console.error('Error name:', verifyError?.name);
            console.error('Error message:', verifyError?.message);
            console.error('Error code:', verifyError?.code);
            console.error('Full error:', verifyError);
            console.log('========================================\n');

            return NextResponse.json({
                success: false,
                error: `SMTP verification failed: ${verifyError?.message || 'unknown error'}`,
                details: {
                    errorCode: verifyError?.code,
                    hint: verifyError?.code === 'EAUTH'
                        ? 'Authentication failed. If using Gmail, ensure you use an App Password (and not your regular password).'
                        : 'Check your network connection and SMTP credentials.'
                }
            }, { status: 502 });
        }

        // Prepare attachment content: convert base64 string to Buffer
        let attachment;
        if (pdfBase64) {
            // Clean up potential data URI prefix
            const base64 = pdfBase64.includes('base64,') ? pdfBase64.split('base64,')[1] : pdfBase64;
            attachment = {
                filename: `ticket-${ticketData.ticketId}.pdf`,
                content: Buffer.from(base64, 'base64')
            };
        }

        // Build email
        const mailOptions = {
            from: EMAIL_USER,
            to,
            subject: `🎉 Ticket Confirmed - ${ticketData.eventTitle}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(to right, #22c55e, #16a34a); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Ticket Confirmed!</h1>
          </div>
          <div style="padding: 30px; background-color: #f9f9f9;">
            <h2 style="color: #333;">Hello ${ticketData.firstName} ${ticketData.lastName},</h2>
            <p style="color: #666; line-height: 1.6;">
              Your ticket for <strong>${ticketData.eventTitle}</strong> has been confirmed!
            </p>
            <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="color: #22c55e; margin-top: 0;">Event Details</h3>
              <p style="margin: 5px 0;"><strong>Event:</strong> ${ticketData.eventTitle}</p>
              <p style="margin: 5px 0;"><strong>Date:</strong> ${ticketData.eventDate}</p>
              <p style="margin: 5px 0;"><strong>Location:</strong> ${ticketData.eventLocation}</p>
              <p style="margin: 5px 0;"><strong>Ticket ID:</strong> ${ticketData.ticketId}</p>
            </div>
            <div style="background: #22c55e; color: white; padding: 15px; border-radius: 10px; margin: 20px 0; text-align: center;">
              <p style="margin: 0; font-size: 18px;"><strong>Payment Status: CONFIRMED ✓</strong></p>
              <p style="margin: 5px 0 0 0;">Amount Paid: ₹${ticketData.price}</p>
            </div>
            <p style="color: #666; line-height: 1.6;">
              Your ticket is attached to this email as a PDF. Please download and present it at the event entrance.
            </p>
            <p style="color: #666; line-height: 1.6; margin-top: 20px;">
              If you have any questions, feel free to contact us at support@aanya.io
            </p>
          </div>
          <div style="background: #333; padding: 20px; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 12px;">
              © 2025 Event Management System. All rights reserved.
            </p>
          </div>
        </div>
      `,
            attachments: attachment ? [attachment] : []
        };

        console.log('\n📤 Attempting to send email...');
        console.log('From:', EMAIL_USER);
        console.log('To:', to);
        console.log('Subject:', mailOptions.subject);
        const info = await transporter.sendMail(mailOptions);

        console.log('\n✅ EMAIL SENT SUCCESSFULLY!');
        console.log('Message ID:', info.messageId);
        console.log('Response:', info.response);
        console.log('========================================\n');

        return NextResponse.json({
            success: true,
            message: "Ticket sent successfully",
            messageId: info.messageId
        }, { status: 200 });
    } catch (error) {
        console.error("\n❌ ========== EMAIL SENDING FAILED ==========");
        console.error("Error:", error);
        console.log("============================================\n");
        return NextResponse.json({
            success: false,
            error: error?.message || "Failed to send email",
        }, { status: 500 });
    }
}