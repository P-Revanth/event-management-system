import jsPDF from "jspdf";

/**
 * Generate a ticket PDF
 * @param {object} ticketData - Ticket information
 * @returns {Blob} PDF blob
 */
export const generateTicketPDF = (ticketData) => {
    const doc = new jsPDF();

    // Set background color
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, 210, 297, 'F');

    // Add header with green background
    doc.setFillColor(34, 197, 94);
    doc.rect(0, 0, 210, 40, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont(undefined, 'bold');
    doc.text('EVENT TICKET', 105, 25, { align: 'center' });

    // Ticket ID
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Ticket ID: ${ticketData.ticketId}`, 105, 35, { align: 'center' });

    // Event Details Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Event Details', 20, 60);

    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Event: ${ticketData.eventTitle}`, 20, 75);
    doc.text(`Date: ${ticketData.eventDate}`, 20, 85);
    doc.text(`Location: ${ticketData.eventLocation}`, 20, 95);
    doc.text(`Price: ₹${ticketData.price}`, 20, 105);

    // Attendee Details Section
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Attendee Details', 20, 130);

    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Name: ${ticketData.firstName} ${ticketData.lastName}`, 20, 145);
    doc.text(`Email: ${ticketData.email}`, 20, 155);
    doc.text(`Phone: ${ticketData.phone}`, 20, 165);
    doc.text(`Age: ${ticketData.age}`, 20, 175);
    doc.text(`Gender: ${ticketData.gender}`, 20, 185);
    doc.text(`T-Shirt Size: ${ticketData.tshirtSize}`, 20, 195);

    // Payment Status
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Payment Status', 20, 220);

    doc.setFontSize(14);
    doc.setTextColor(34, 197, 94);
    doc.text('CONFIRMED', 20, 235);

    // Booking Date
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Booking Date: ${ticketData.bookingDate}`, 20, 250);

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Please present this ticket at the event entrance.', 105, 270, { align: 'center' });
    doc.text('For queries, contact: support@aanya.io', 105, 280, { align: 'center' });

    // Generate QR code placeholder
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(160, 130, 40, 40);
    doc.setFontSize(8);
    doc.text('QR CODE', 180, 152, { align: 'center' });

    return doc.output('blob');
};

/**
 * Download ticket PDF
 * @param {object} ticketData - Ticket information
 */
export const downloadTicketPDF = (ticketData) => {
    const doc = new jsPDF();

    // Set background color
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, 210, 297, 'F');

    // Add header with green background
    doc.setFillColor(34, 197, 94);
    doc.rect(0, 0, 210, 40, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont(undefined, 'bold');
    doc.text('EVENT TICKET', 105, 25, { align: 'center' });

    // Ticket ID
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Ticket ID: ${ticketData.ticketId}`, 105, 35, { align: 'center' });

    // Event Details Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Event Details', 20, 60);

    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Event: ${ticketData.eventTitle}`, 20, 75);
    doc.text(`Date: ${ticketData.eventDate}`, 20, 85);
    doc.text(`Location: ${ticketData.eventLocation}`, 20, 95);
    doc.text(`Price: ₹${ticketData.price}`, 20, 105);

    // Attendee Details Section
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Attendee Details', 20, 130);

    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Name: ${ticketData.firstName} ${ticketData.lastName}`, 20, 145);
    doc.text(`Email: ${ticketData.email}`, 20, 155);
    doc.text(`Phone: ${ticketData.phone}`, 20, 165);
    doc.text(`Age: ${ticketData.age}`, 20, 175);
    doc.text(`Gender: ${ticketData.gender}`, 20, 185);
    doc.text(`T-Shirt Size: ${ticketData.tshirtSize}`, 20, 195);

    // Payment Status
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Payment Status', 20, 220);

    doc.setFontSize(14);
    doc.setTextColor(34, 197, 94);
    doc.text('CONFIRMED', 20, 235);

    // Booking Date
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Booking Date: ${ticketData.bookingDate}`, 20, 250);

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Please present this ticket at the event entrance.', 105, 270, { align: 'center' });
    doc.text('For queries, contact: support@aanya.io', 105, 280, { align: 'center' });

    // Generate QR code placeholder
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(160, 130, 40, 40);
    doc.setFontSize(8);
    doc.text('QR CODE', 180, 152, { align: 'center' });

    // Download the PDF
    doc.save(`ticket-${ticketData.ticketId}.pdf`);
};
