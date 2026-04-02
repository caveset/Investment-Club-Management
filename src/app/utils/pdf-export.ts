import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { User, PaymentRecord } from '../types';

export function exportMonthlyReport(
  users: User[],
  payments: PaymentRecord[],
  month: number,
  year: number
) {
  const doc = new jsPDF();
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Title
  doc.setFontSize(20);
  doc.text('Investment Club - Monthly Report', 14, 22);
  
  doc.setFontSize(12);
  doc.text(`Period: ${months[month]} ${year}`, 14, 32);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 40);

  // Summary Statistics
  const memberUsers = users.filter(u => !u.isAdmin);
  const monthPayments = payments.filter(p => p.month === month && p.year === year && p.proofs?.length > 0);
  const totalPaid = monthPayments.length;
  const totalExpected = memberUsers.length;
  const paymentRate = totalExpected > 0 ? Math.round((totalPaid / totalExpected) * 100) : 0;

  doc.setFontSize(14);
  doc.text('Summary', 14, 52);
  
  doc.setFontSize(11);
  doc.text(`Total Members: ${totalExpected}`, 14, 62);
  doc.text(`Payments Received: ${totalPaid}`, 14, 70);
  doc.text(`Pending: ${totalExpected - totalPaid}`, 14, 78);
  doc.text(`Payment Rate: ${paymentRate}%`, 14, 86);

  // Detailed Payment Table
  const tableData = memberUsers.map(user => {
    const payment = payments.find(p => 
      p.userId === user.id && p.month === month && p.year === year
    );
    const proofs = payment?.proofs || [];
    const hasPaid = proofs.length > 0;
    const status = hasPaid ? 'Paid' : 'Unpaid';
    const date = hasPaid && proofs.length > 0
      ? new Date(proofs[0].uploadedAt).toLocaleDateString() 
      : '-';
    const proofsCount = proofs.length;

    return [user.name, user.email, user.phone, status, date, proofsCount > 0 ? `${proofsCount}` : '-'];
  });

  autoTable(doc, {
    startY: 95,
    head: [['Name', 'Email', 'Phone', 'Status', 'Upload Date', 'Proofs']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 45 },
      2: { cellWidth: 30 },
      3: { cellWidth: 25 },
      4: { cellWidth: 30 },
      5: { cellWidth: 20 }
    },
    didParseCell: function(data) {
      if (data.section === 'body' && data.column.index === 3) {
        if (data.cell.raw === 'Paid') {
          data.cell.styles.textColor = [22, 163, 74]; // green
          data.cell.styles.fontStyle = 'bold';
        } else {
          data.cell.styles.textColor = [220, 38, 38]; // red
          data.cell.styles.fontStyle = 'bold';
        }
      }
    }
  });

  // Yearly Overview
  const finalY = (doc as any).lastAutoTable.finalY || 95;
  
  doc.setFontSize(14);
  doc.text('12-Month Overview', 14, finalY + 15);

  // Create 12-month overview table
  const yearlyTableData = memberUsers.map(user => {
    const row = [user.name];
    let paidCount = 0;
    
    for (let m = 0; m < 12; m++) {
      const payment = payments.find(p => 
        p.userId === user.id && p.month === m && p.year === year
      );
      const proofs = payment?.proofs || [];
      const hasPaid = proofs.length > 0;
      row.push(hasPaid ? '✓' : '✗');
      if (hasPaid) paidCount++;
    }
    
    row.push(`${paidCount}/12`);
    return row;
  });

  const monthHeaders = ['Name', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Total'];

  autoTable(doc, {
    startY: finalY + 20,
    head: [monthHeaders],
    body: yearlyTableData,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246], fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 30 }
    },
    didParseCell: function(data) {
      if (data.section === 'body' && data.column.index > 0 && data.column.index < 13) {
        if (data.cell.raw === '✓') {
          data.cell.styles.textColor = [22, 163, 74];
          data.cell.styles.halign = 'center';
        } else if (data.cell.raw === '✗') {
          data.cell.styles.textColor = [220, 38, 38];
          data.cell.styles.halign = 'center';
        }
      }
    }
  });

  // Save the PDF
  doc.save(`investment-club-report-${months[month]}-${year}.pdf`);
}