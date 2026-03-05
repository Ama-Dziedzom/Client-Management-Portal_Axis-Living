const STUDIO_NAME = 'Axis Living';
const YOUR_NAME = 'Ama';
const CONTACT_EMAIL = 'hello@axisliving.co.zm';

// Brand Colors from Project
const COLORS = {
  background: '#FAF9F6', // Secondary / Background
  primary: '#2F402C',    // Dark Green / Accent
  tan: '#C6B9AA',        // Tan
  charcoal: '#1C1C1C',   // Foreground
  gold: '#C9A84C',       // Gold
  white: '#FFFFFF'
};

const baseStyles = `
  body { 
    background-color: ${COLORS.background}; 
    margin: 0; 
    padding: 0; 
    font-family: 'Manrope', 'Helvetica Neue', Helvetica, Arial, sans-serif; 
    -webkit-font-smoothing: antialiased;
  }
  .wrapper { 
    background-color: ${COLORS.background}; 
    padding: 60px 20px; 
  }
  .container { 
    max-width: 600px; 
    margin: 0 auto; 
    background: ${COLORS.white}; 
    border-radius: 8px; 
    overflow: hidden; 
    box-shadow: 0 10px 30px rgba(47, 64, 44, 0.08); /* Using Brand Green in shadow */
  }
  .header { 
    background-color: ${COLORS.primary}; /* Brand Dark Green */
    padding: 50px 20px; 
    text-align: center; 
  }
  .header h1 { 
    color: ${COLORS.white}; 
    margin: 0; 
    font-family: 'Quinsi', Georgia, serif; 
    font-size: 22px; 
    letter-spacing: 5px; 
    text-transform: uppercase; 
    font-weight: normal;
  }
  .body { 
    padding: 60px 50px; 
    color: ${COLORS.charcoal}; 
    line-height: 1.8; 
    font-family: 'Manrope', sans-serif;
  }
  .body h2 { 
    font-family: 'Cormorant Garamond', Georgia, serif; 
    color: ${COLORS.primary}; 
    font-size: 38px; 
    margin-top: 0; 
    margin-bottom: 30px;
    font-weight: 300;
    line-height: 1.1;
  }
  .cta-button { 
    display: inline-block; 
    background-color: ${COLORS.primary}; 
    color: ${COLORS.white} !important; 
    padding: 22px 44px; 
    text-decoration: none; 
    border-radius: 99px; 
    font-weight: 600; 
    margin: 35px 0;
    text-transform: uppercase;
    font-size: 10px;
    letter-spacing: 3px;
    font-family: 'Manrope', sans-serif;
  }
  .details-card { 
    background-color: ${COLORS.background}; 
    padding: 40px; 
    border-radius: 8px; 
    margin: 30px 0; 
    border: 1px solid #e2e8f0;
  }
  .details-row {
    margin-bottom: 20px;
  }
  .details-label {
    font-weight: bold;
    color: ${COLORS.tan}; 
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 2px;
    display: block;
    margin-bottom: 8px;
    font-family: 'Manrope', sans-serif;
  }
  .details-value {
    color: ${COLORS.primary}; 
    font-size: 16px;
    font-weight: 500;
  }
  .message-preview {
    background-color: ${COLORS.background}; 
    padding: 30px; 
    border-left: 4px solid ${COLORS.gold}; 
    font-style: italic;
    margin: 30px 0;
    color: #444444;
    line-height: 1.8;
    font-family: 'Playfair Display', Georgia, serif;
  }
  .signature {
    margin-top: 50px;
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-style: italic;
    color: ${COLORS.primary}; 
    font-size: 20px;
    font-weight: 300;
  }
  .ps-line {
    margin-top: 40px;
    padding-top: 30px;
    border-top: 1px solid #e2e8f0;
    font-size: 14px;
    color: #64748b;
    line-height: 1.6;
    font-family: 'Manrope', sans-serif;
  }
  .footer { 
    padding: 60px; 
    text-align: center; 
    font-size: 11px; 
    color: #94a3b8; 
    letter-spacing: 1px;
    font-family: 'Manrope', sans-serif;
  }
  .footer p { margin: 10px 0; }
  .footer a { color: ${COLORS.tan}; text-decoration: underline; font-weight: bold; }
  
  /* Mobile responsiveness */
  @media only screen and (max-width: 600px) {
    .body { padding: 40px 25px !important; }
    .body h2 { font-size: 32px !important; }
  }
`;

const wrap = (content, footerNote = '') => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Cormorant+Garamond:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    ${baseStyles}
    /* Font override for specific high-end look */
    .header h1, .body h2 {
      font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif !important;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1 style="letter-spacing: 8px; font-weight: 300; font-size: 20px;">${STUDIO_NAME}</h1>
      </div>
      <div class="body">
        ${content}
      </div>
      <div class="footer">
        ${footerNote ? `<p style="margin-bottom: 25px; color: ${COLORS.primary}; font-weight: bold;">${footerNote}</p>` : ''}
        <p>&copy; ${new Date().getFullYear()} ${STUDIO_NAME}</p>
        <p>${CONTACT_EMAIL}</p>
        <p><a href="#">Unsubscribe</a></p>
      </div>
    </div>
  </div>
</body>
</html>
`;

export const emailTemplates = {
  lookbookDelivery: (name) => ({
    subject: "Your Behind the Design Lookbook ✦",
    html: wrap(`
      <h2>Your lookbook is here, ${name}.</h2>
      <p>Thank you for downloading Behind the Design. I put a lot of care into this one and I hope it gives you a real sense of how we think about spaces.</p>
      
      <a href="https://axisliving.co.zm/axis-living-lookbook.pdf" class="cta-button">Download Your Lookbook</a>
      
      <p>Inside you'll find material palettes from our recent projects, spatial planning principles we return to again and again, and some thoughts on what makes a room feel genuinely finished versus just furnished.</p>
      
      <div class="signature">
        ${YOUR_NAME}, ${STUDIO_NAME}
      </div>
      
      <div class="ps-line">
        <strong>P.S.</strong> Next week I'll share something we rarely talk about publicly — the mistakes we made on one of our most ambitious projects, and what we learned from them.
      </div>
    `)
  }),

  bookingConfirmation: (name, date, time, meetingLink) => ({
    subject: `You're booked — see you ${date} ✦`,
    html: wrap(`
      <h2>Your consultation is confirmed.</h2>
      
      <div class="details-card">
        <div class="details-row">
          <span class="details-label">Date</span>
          <span class="details-value">${date}</span>
        </div>
        <div class="details-row">
          <span class="details-label">Time</span>
          <span class="details-value">${time}</span>
        </div>
        <div class="details-row">
          <span class="details-label">Format</span>
          <span class="details-value">Video call</span>
        </div>
        
        <div style="margin-top: 10px;">
          <a href="${meetingLink}" class="cta-button" style="margin: 0;">Join Meeting</a>
        </div>
      </div>
      
      <p>Before our call, it helps to have a rough idea of your space — photos are great if you have them. Also think about your timeline and a ballpark budget range. That's all you need.</p>
      
      <p>Looking forward to hearing about your space.</p>
      
      <div class="signature">
        ${YOUR_NAME}
      </div>
    `, "Need to reschedule? Use the link in your original calendar invite.")
  }),

  portalWelcome: (name, email, password, portalUrl) => ({
    subject: "Your client portal is ready ✦",
    html: wrap(`
      <h2>Welcome to your project portal, ${name}.</h2>
      <p>Your dedicated project space is ready. You can track your project progress, view documents, browse your moodboard, and message us directly — all in one place.</p>
      
      <div class="details-card">
        <div class="details-row">
          <span class="details-label">Portal URL</span>
          <span class="details-value">${portalUrl}</span>
        </div>
        <div class="details-row">
          <span class="details-label">Email</span>
          <span class="details-value">${email}</span>
        </div>
        <div class="details-row">
          <span class="details-label">Password</span>
          <span class="details-value"><code>${password}</code></span>
        </div>
      </div>

      <a href="${portalUrl}" class="cta-button">Go to My Portal</a>
      
      <p>We recommend bookmarking your portal URL for easy access.</p>
      
      <div class="signature">
        ${YOUR_NAME}, ${STUDIO_NAME}
      </div>
    `, "Keep this email safe — it contains your login details.")
  }),

  newPortalMessage: (clientName, messagePreview, portalUrl) => ({
    subject: "New message from your designer ✦",
    html: wrap(`
      <h2>You have a new message.</h2>
      
      <div class="message-preview">
        "${messagePreview}"
      </div>
      
      <a href="${portalUrl}" class="cta-button">View Full Message</a>
      
      <div class="signature">
        ${STUDIO_NAME}
      </div>
    `, `Reply directly in your portal at <a href="${portalUrl}">${portalUrl}</a>`)
  })
};
