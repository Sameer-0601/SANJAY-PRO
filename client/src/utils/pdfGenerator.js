import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

export default function generatePDF(invoice, user, currency) {
  const doc = new jsPDF();
  const ccy = currency?.code || 'USD';
  const safeNum = (num) => (num || 0).toFixed(2);
  const safeFormatDate = (d) => { try { return format(new Date(d), 'MMMM dd, yyyy'); } catch(e) { return 'N/A'; } };

  // --- COLORS & STYLES ---
  const primaryColor = [79, 70, 229]; // #4F46E5 (Indigo 600)
  const textColor = [31, 41, 55]; // Gray 800
  const lightText = [107, 114, 128]; // Gray 500

  // ---------- HEADER SECTION ----------
  // Company Logo / Text
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textColor);
  doc.text(user?.companyName || 'NEXUS INC', 14, 25);

  // Decorative Top Right Badge
  doc.setFillColor(243, 244, 246); // Gray 100 bg
  doc.roundedRect(150, 15, 46, 12, 2, 2, 'F');
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('INVOICE', 173, 23, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...lightText);
  doc.text(`NO. ${invoice.invoiceNumber || 'DRAFT'}`, 196, 34, { align: 'right' });

  // Divider Line
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.5);
  doc.line(14, 42, 196, 42);

  // ---------- CLIENT & INFO DATES ----------
  // Bill To Label
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...lightText);
  doc.text('BILLED TO', 14, 52);

  // Client Details
  doc.setFontSize(12);
  doc.setTextColor(...textColor);
  doc.text(invoice.clientId?.name || 'Unknown Client', 14, 60);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...lightText);
  let yPos = 66;
  if (invoice.clientId?.email) { doc.text(invoice.clientId.email, 14, yPos); yPos += 5; }
  if (invoice.clientId?.phone) { doc.text(invoice.clientId.phone, 14, yPos); yPos += 5; }
  if (invoice.clientId?.address) {
    const splitAddress = doc.splitTextToSize(invoice.clientId.address, 65);
    doc.text(splitAddress, 14, yPos);
  }

  // Invoice Dates Matrix (Right Aligned)
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('ISSUE DATE', 150, 52, { align: 'right' });
  doc.text('DUE DATE', 196, 52, { align: 'right' });

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textColor);
  doc.text(invoice.date ? safeFormatDate(invoice.date) : 'N/A', 150, 60, { align: 'right' });
  
  if (invoice.dueDate) {
    // Add subtle warning color if due date is close/passed, logic could go here
    doc.text(safeFormatDate(invoice.dueDate), 196, 60, { align: 'right' });
  } else {
    doc.text('N/A', 196, 60, { align: 'right' });
  }

  // ---------- ITEMS TABLE ----------
  const itemsArray = invoice.items || [];
  const tableData = itemsArray.map(item => [
    item.description || 'Item Description',
    (item.qty || 1).toString(),
    `${safeNum(item.price)} ${ccy}`,
    `${safeNum((item.qty || 1) * (item.price || 0))} ${ccy}`
  ]);

  autoTable(doc, {
    startY: Math.max(85, yPos + 10),
    head: [['DESCRIPTION', 'QTY', 'PRICE', 'AMOUNT']],
    body: tableData,
    theme: 'grid',
    headStyles: { 
      fillColor: [249, 250, 251], // Very light gray hex #F9FAFB
      textColor: [55, 65, 81],    // Gray 700
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'left',
      lineColor: [229, 231, 235],
      lineWidth: 0.1
    },
    bodyStyles: {
      textColor: [31, 41, 55],
      fontSize: 10,
      cellPadding: 5,
      lineColor: [229, 231, 235],
      lineWidth: 0.1
    },
    columnStyles: {
      0: { cellWidth: 80, halign: 'left' },
      1: { halign: 'center' },
      2: { halign: 'right' },
      3: { halign: 'right', fontStyle: 'bold' }
    },
    alternateRowStyles: {
      fillColor: [253, 254, 255]
    },
    styles: { overflow: 'linebreak' },
    margin: { left: 14, right: 14 }
  });

  // ---------- SUMMARY CALCULATION BLOCK ----------
  const finalY = doc.lastAutoTable.finalY || 100;
  
  // Create a subtle background box for the totals to make it look premium
  doc.setFillColor(249, 250, 251); 
  doc.roundedRect(120, finalY + 8, 76, 50, 3, 3, 'F');

  // We align the Labels strictly to x=155 and Values to x=190
  const labelX = 152;
  const valueX = 190;
  let summaryY = finalY + 18;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...lightText);
  doc.text('Subtotal:', labelX, summaryY, { align: 'right' });
  doc.setTextColor(...textColor);
  doc.text(`${safeNum(invoice.subtotal)}`, valueX, summaryY, { align: 'right' });
  
  if (invoice.discount > 0) {
    summaryY += 8;
    doc.setTextColor(...lightText);
    doc.text(`Discount:`, labelX, summaryY, { align: 'right' });
    doc.setTextColor(16, 185, 129); // Green 500
    doc.text(`-${safeNum(invoice.discount)}`, valueX, summaryY, { align: 'right' });
  }
  
  if (invoice.tax > 0) {
    summaryY += 8;
    doc.setTextColor(...lightText);
    doc.text(`Tax:`, labelX, summaryY, { align: 'right' });
    doc.setTextColor(...textColor);
    doc.text(`+${safeNum(invoice.tax)}`, valueX, summaryY, { align: 'right' });
  }
  
  // Separator Line inside the summary box
  summaryY += 6;
  doc.setDrawColor(229, 231, 235);
  doc.line(125, summaryY, 191, summaryY);
  
  // Total Row
  summaryY += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textColor);
  doc.text('TOTAL:', labelX, summaryY, { align: 'right' });
  
  doc.setFontSize(16);
  doc.setTextColor(...primaryColor);
  doc.text(`${safeNum(invoice.total)} ${ccy}`, valueX, summaryY + 1, { align: 'right' });

  // ---------- FOOTER NOTE ----------
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(...lightText);
  doc.text('Thank you for your business. For any inquiries regarding this invoice, please contact us.', 105, 280, { align: 'center' });

  // Output File
  doc.save(`Invoice_${invoice.invoiceNumber || 'Draft'}.pdf`);
}
