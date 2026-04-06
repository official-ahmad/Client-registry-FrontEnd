// Utility functions for WhatsApp and Receipt generation

export const sendWhatsApp = (phone, message) => {
  // Remove non-numeric characters from phone
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Format for WhatsApp (add country code if not present)
  const formattedPhone = cleanPhone.startsWith('92') ? cleanPhone : `92${cleanPhone.replace(/^0/, '')}`;
  
  // Create WhatsApp URL
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
  
  // Open in new window
  window.open(whatsappUrl, '_blank');
};

export const formatWhatsAppMessage = (job) => {
  return `*Official-Ahmad Mobile Unlocking*

Dear ${job.customerName},

Your job details:
━━━━━━━━━━━━━━━
🆔 Job ID: *${job.jobId}*
📱 Device: ${job.deviceModel}
🔧 Service: ${job.serviceType}
📊 Status: *${job.status}*
💰 Price: PKR ${job.price.toLocaleString()}
━━━━━━━━━━━━━━━

${job.status === 'Ready' ? '✅ Your device is ready for pickup!' : ''}
${job.status === 'In-Progress' ? '⏳ We are working on your device.' : ''}
${job.status === 'Received' ? '📥 We have received your device.' : ''}

For any queries, please contact us.

Thank you for choosing Official-Ahmad!`;
};

const getReceiptHTML = (job, forPrint = false) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Receipt - ${job.jobId}</title>
  <style>
    @media print {
      @page { margin: 0.5cm; size: 80mm auto; }
      body { margin: 0; }
      .no-print { display: none !important; }
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      max-width: 80mm;
      margin: 0 auto;
      padding: 15px;
      background: #fff;
      color: #1a1a1a;
    }
    .receipt {
      border: 2px solid #1a1a1a;
      border-radius: 8px;
      padding: 15px;
    }
    .header {
      text-align: center;
      border-bottom: 2px dashed #333;
      padding-bottom: 12px;
      margin-bottom: 12px;
    }
    .logo {
      font-size: 20px;
      font-weight: 800;
      color: #0891b2;
      margin-bottom: 4px;
    }
    .subtitle {
      font-size: 11px;
      color: #666;
      margin-bottom: 2px;
    }
    .job-id {
      background: #0891b2;
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 700;
      display: inline-block;
      margin-top: 8px;
    }
    .section {
      margin: 12px 0;
      padding-bottom: 12px;
      border-bottom: 1px dashed #ddd;
    }
    .section:last-of-type {
      border-bottom: none;
    }
    .section-title {
      font-size: 10px;
      font-weight: 600;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }
    .row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 6px 0;
      font-size: 13px;
    }
    .label {
      color: #666;
      font-weight: 500;
    }
    .value {
      font-weight: 600;
      color: #1a1a1a;
      text-align: right;
    }
    .total-section {
      background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
      color: white;
      padding: 12px;
      border-radius: 8px;
      margin-top: 12px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .total-label {
      font-size: 14px;
      font-weight: 600;
    }
    .total-value {
      font-size: 20px;
      font-weight: 800;
    }
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
    }
    .status-received { background: #fee2e2; color: #dc2626; }
    .status-in-progress { background: #fef3c7; color: #d97706; }
    .status-ready { background: #dcfce7; color: #16a34a; }
    .status-delivered { background: #dbeafe; color: #2563eb; }
    .footer {
      text-align: center;
      margin-top: 15px;
      padding-top: 12px;
      border-top: 2px dashed #333;
    }
    .footer p {
      font-size: 10px;
      color: #666;
      margin: 3px 0;
    }
    .footer .thank-you {
      font-size: 12px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 4px;
    }
    .actions {
      display: flex;
      gap: 10px;
      justify-content: center;
      margin-top: 20px;
      padding: 15px;
      background: #f5f5f5;
      border-radius: 8px;
    }
    .btn {
      padding: 10px 24px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-print {
      background: #0891b2;
      color: white;
    }
    .btn-print:hover { background: #0e7490; }
    .btn-close {
      background: #6b7280;
      color: white;
    }
    .btn-close:hover { background: #4b5563; }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <div class="logo">⚙️ OFFICIAL-AHMAD</div>
      <div class="subtitle">Mobile Unlocking Service</div>
      <div class="subtitle">Professional & Reliable</div>
      <div class="job-id">${job.jobId}</div>
    </div>

    <div class="section">
      <div class="section-title">Receipt Details</div>
      <div class="row">
        <span class="label">Date</span>
        <span class="value">${new Date(job.receivedAt).toLocaleDateString('en-GB')}</span>
      </div>
      <div class="row">
        <span class="label">Time</span>
        <span class="value">${new Date(job.receivedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Customer Info</div>
      <div class="row">
        <span class="label">Name</span>
        <span class="value">${job.customerName || 'N/A'}</span>
      </div>
      <div class="row">
        <span class="label">Phone</span>
        <span class="value">${job.customerPhone || 'N/A'}</span>
      </div>
      <div class="row">
        <span class="label">CNIC</span>
        <span class="value">${job.cnic || 'N/A'}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Device Info</div>
      <div class="row">
        <span class="label">Model</span>
        <span class="value">${job.deviceModel || 'N/A'}</span>
      </div>
      <div class="row">
        <span class="label">Service</span>
        <span class="value">${job.serviceType || 'N/A'}</span>
      </div>
      <div class="row">
        <span class="label">Status</span>
        <span class="value">
          <span class="status-badge status-${job.status.toLowerCase().replace('-', '-')}">${job.status}</span>
        </span>
      </div>
    </div>

    <div class="total-section">
      <div class="total-row">
        <span class="total-label">Total Amount</span>
        <span class="total-value">PKR ${(job.price || 0).toLocaleString()}</span>
      </div>
    </div>

    <div class="footer">
      <p class="thank-you">Thank you for your business!</p>
      <p>Keep this receipt safe</p>
      <p>Track: ${job.jobId}</p>
      <p>© 2026 Official-Ahmad</p>
    </div>
  </div>
  
  ${!forPrint ? `
  <div class="actions no-print">
    <button class="btn btn-print" onclick="window.print()">🖨️ Print</button>
    <button class="btn btn-close" onclick="window.close()">✕ Close</button>
  </div>
  ` : ''}
  
  ${forPrint ? `
  <script>
    window.onload = function() {
      window.print();
    };
  </script>
  ` : ''}
</body>
</html>
  `;
};

// View receipt in new window (responsive, no auto-print)
export const viewReceipt = (job) => {
  const receiptWindow = window.open('', '_blank', 'width=400,height=700');
  receiptWindow.document.write(getReceiptHTML(job, false));
  receiptWindow.document.close();
};

// Download/Print receipt (triggers print dialog which can save as PDF)
export const downloadReceipt = (job) => {
  const receiptWindow = window.open('', '_blank', 'width=400,height=700');
  receiptWindow.document.write(getReceiptHTML(job, true));
  receiptWindow.document.close();
};

// Legacy function for backward compatibility
export const generateReceipt = downloadReceipt;
