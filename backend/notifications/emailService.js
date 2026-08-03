const nodemailer = require('nodemailer');

// In-memory cooldown store for single-instance Node.js deployments
const loginEmailCooldowns = new Map();

/**
 * Utility to parse User-Agent header into human-readable Browser & OS
 */
const parseUserAgent = (uaString = '') => {
  if (!uaString) return { browser: 'Web Browser', os: 'Unknown OS' };

  let os = 'Unknown OS';
  if (/windows nt 10/i.test(uaString)) os = 'Windows 10/11';
  else if (/windows/i.test(uaString)) os = 'Windows';
  else if (/macintosh|mac os x/i.test(uaString)) os = 'macOS';
  else if (/android/i.test(uaString)) os = 'Android';
  else if (/iphone|ipad|ipod/i.test(uaString)) os = 'iOS';
  else if (/linux/i.test(uaString)) os = 'Linux';

  let browser = 'Web Browser';
  if (/edg\//i.test(uaString)) browser = 'Microsoft Edge';
  else if (/chrome|crios/i.test(uaString)) browser = 'Google Chrome';
  else if (/firefox|fxios/i.test(uaString)) browser = 'Mozilla Firefox';
  else if (/safari/i.test(uaString) && !/chrome/i.test(uaString)) browser = 'Apple Safari';

  return { browser, os };
};

/**
 * Creates an SMTP Transporter for real email notifications.
 * Enforces strictly-configured connection timeouts.
 */
const createTransporter = () => {
  const user = (process.env.SMTP_USER || '').trim();
  const pass = (process.env.SMTP_PASS || '').trim();

  // Validate SMTP Configuration: Skip if unconfigured
  if (!user || !pass) {
    return null;
  }

  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  const isGmail = host.includes('gmail') || process.env.SMTP_SERVICE === 'gmail';

  const baseConfig = {
    auth: { user, pass },
    connectionTimeout: 10000, // 10 seconds
    socketTimeout: 10000,     // 10 seconds
    greetingTimeout: 5000,    // 5 seconds
    tls: { rejectUnauthorized: false },
  };

  if (isGmail) {
    return nodemailer.createTransport({
      service: 'gmail',
      ...baseConfig,
    });
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    ...baseConfig,
  });
};

/**
 * Verifies SMTP connection during backend server startup.
 */
const verifyTransporter = async () => {
  const user = (process.env.SMTP_USER || '').trim();
  const pass = (process.env.SMTP_PASS || '').trim();

  if (!user || !pass) {
    console.log('⚠️ [EMAIL SYSTEM] SMTP credentials not set in environment. Real email sending is disabled.');
    return false;
  }

  const transporter = createTransporter();
  if (!transporter) return false;

  try {
    await transporter.verify();
    console.log('✅ [EMAIL SYSTEM] SMTP Transporter successfully verified and ready to dispatch emails.');
    return true;
  } catch (err) {
    const sanitizedError = err.message ? err.message.replace(pass, '****') : 'Connection failed';
    console.error(`❌ [EMAIL SYSTEM] Transporter verification failed: ${sanitizedError}`);
    return false;
  }
};

/**
 * Checks and updates cooldown window for sign-in security emails.
 */
const isCooldownActive = (email) => {
  const cooldownMinutes = parseInt(process.env.LOGIN_EMAIL_COOLDOWN_MINUTES || '15', 10);
  const cooldownMs = cooldownMinutes * 60 * 1000;
  const now = Date.now();

  const lastSent = loginEmailCooldowns.get(email);
  if (lastSent && now - lastSent < cooldownMs) {
    const remainingSecs = Math.ceil((cooldownMs - (now - lastSent)) / 1000);
    console.log(`[EMAIL SKIPPED]\nType: Login Notification\nRecipient: ${email}\nReason: Cooldown active (${remainingSecs}s remaining)\nTime: ${new Date().toISOString()}`);
    return true;
  }

  loginEmailCooldowns.set(email, now);
  return false;
};

/**
 * Helper to dispatch structured email with Multi-Part MIME (HTML + Plain Text) & Headers
 */
const sendMailHelper = async ({ to, subject, html, text, type }) => {
  if (!to) return { success: false, reason: 'Missing recipient email' };

  const user = (process.env.SMTP_USER || '').trim();
  const pass = (process.env.SMTP_PASS || '').trim();

  if (!user || !pass) {
    console.warn(`[EMAIL WARN]\nType: ${type}\nRecipient: ${to}\nStatus: SKIPPED (SMTP credentials not configured)\nTime: ${new Date().toISOString()}`);
    return { success: false, skipped: true, reason: 'SMTP not configured' };
  }

  const transporter = createTransporter();
  if (!transporter) {
    return { success: false, skipped: true, reason: 'Transporter creation failed' };
  }

  const mailOptions = {
    from: `"NexusMart E-Commerce" <${user}>`,
    to,
    subject,
    text,
    html,
    headers: {
      'X-Mailer': 'NexusMart-SecurityEngine/1.0',
      'Reply-To': user,
      'Date': new Date().toUTCString(),
    },
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL DISPATCH]\nType: ${type}\nRecipient: ${to}\nMessageID: ${info.messageId}\nStatus: SUCCESS\nTime: ${new Date().toISOString()}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    const sanitizedMsg = error.message ? error.message.replace(pass, '****') : 'Dispatch failed';
    console.error(`[EMAIL ERROR]\nType: ${type}\nRecipient: ${to}\nError: ${sanitizedMsg}\nTime: ${new Date().toISOString()}`);
    return { success: false, error: sanitizedMsg };
  }
};

/**
 * Sends a welcome email upon user registration.
 */
const sendWelcomeEmail = async ({ name, email }) => {
  const recipientEmail = (email || '').trim().toLowerCase();
  if (!recipientEmail) return { success: false };

  const emailSubject = `🎉 Welcome to NexusMart E-Commerce, ${name || 'Valued Customer'}!`;

  const textContent = `
Welcome to NexusMart E-Commerce, ${name || 'Valued Customer'}!

Thank you for signing up with NexusMart E-Commerce. Your account has been registered successfully.
🎁 Welcome Bonus Unlocked: 100 Loyalty Points credited to ${recipientEmail}.

Warm regards,
NexusMart Team
© 2026 NexusMart E-Commerce Inc.
  `.trim();

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #0f172a; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
      <div style="background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #ffffff;">Nexus<span style="color: #6366f1;">Mart</span></h1>
        <p style="margin: 6px 0 0 0; font-size: 13px; color: #e0e7ff; font-weight: 500;">Official Welcome & Account Confirmation</p>
      </div>
      <div style="padding: 32px 28px; color: #0f172a;">
        <h2 style="color: #0f172a; font-size: 22px; margin-top: 0; margin-bottom: 16px; font-weight: 700;">Welcome aboard, ${name || 'Customer'}! 👋</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 20px;">
          Thank you for signing up with <strong>NexusMart E-Commerce</strong>. Your account has been registered successfully and is ready for use.
        </p>
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 12px; border: 1px solid #bbf7d0; margin: 24px 0;">
          <p style="margin: 0 0 8px 0; font-size: 15px; color: #166534; font-weight: 700;">🎁 Welcome Bonus Unlocked!</p>
          <p style="margin: 0 0 4px 0; font-size: 13px; color: #15803d;">You earned <strong>100 Loyalty Points</strong> automatically credited to your account.</p>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #166534;"><strong>Registered Email:</strong> <code>${recipientEmail}</code></p>
        </div>
        <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 24px;">
          Explore our wide range of products, track orders live, and make use of our <strong>AI Assistant</strong> for personalized shopping recommendations.
        </p>
        <div style="border-top: 1px solid #f1f5f9; padding-top: 20px; margin-top: 24px;">
          <p style="font-size: 13px; color: #64748b; margin: 0;">Warm regards,<br><strong style="color: #0f172a;">NexusMart Team</strong></p>
        </div>
      </div>
      <div style="background-color: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #f1f5f9; color: #94a3b8; font-size: 12px;">
        <p style="margin: 0 0 4px 0;">© 2026 NexusMart E-Commerce Inc. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendMailHelper({
    to: recipientEmail,
    subject: emailSubject,
    text: textContent,
    html: htmlContent,
    type: 'Welcome Notification',
  });
};

/**
 * Sends a security notification email upon successful user sign-in.
 */
const sendLoginNotificationEmail = async ({ name, email, userAgent, clientIp, time = new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' }) }) => {
  const recipientEmail = (email || '').trim().toLowerCase();
  if (!recipientEmail) return { success: false };

  // Check Cooldown to prevent email spamming
  if (isCooldownActive(recipientEmail)) {
    return { success: false, skipped: true, reason: 'Cooldown active' };
  }

  const { browser, os } = parseUserAgent(userAgent);
  const ipDisplay = clientIp && clientIp !== '::1' && clientIp !== '127.0.0.1' ? clientIp : 'Local / Internal Network';

  const emailSubject = `🔐 Security Notification: Successful Sign-In to NexusMart`;

  const textContent = `
Hello ${name || 'Valued Customer'},

A new sign-in was detected for your NexusMart account.

Sign-In Details:
- Account Email: ${recipientEmail}
- Date & Time: ${time}
- Browser: ${browser}
- Operating System: ${os}
- IP Address: ${ipDisplay}

Security Note: If you authorized this sign-in, no further action is required. If you did not perform this login, please reset your password immediately.

Sincerely,
NexusMart Security Team
  `.trim();

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #0f172a; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
      <div style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #ffffff;">Nexus<span style="color: #818cf8;">Mart</span></h1>
        <p style="margin: 6px 0 0 0; font-size: 13px; color: #c7d2fe; font-weight: 500;">Account Sign-In Security Notice</p>
      </div>
      <div style="padding: 32px 28px; color: #0f172a;">
        <h2 style="color: #0f172a; font-size: 20px; margin-top: 0; margin-bottom: 12px; font-weight: 700;">Hello ${name || 'Valued Customer'},</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 20px;">
          This email confirms that a successful sign-in occurred for your <strong>NexusMart E-Commerce</strong> account.
        </p>
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; margin: 24px 0;">
          <h3 style="margin: 0 0 14px 0; font-size: 14px; color: #1e293b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Sign-In Security Details</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #334155;">
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-weight: 600; width: 140px;">Account Email:</td>
              <td style="padding: 6px 0; font-weight: 700; color: #0f172a;">${recipientEmail}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Date & Time:</td>
              <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${time}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Browser:</td>
              <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${browser}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Operating System:</td>
              <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${os}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-weight: 600;">IP Address:</td>
              <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${ipDisplay}</td>
            </tr>
          </table>
        </div>
        <div style="background-color: #eff6ff; padding: 16px 20px; border-radius: 12px; border-left: 4px solid #3b82f6; margin-bottom: 24px;">
          <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #1e40af;">
            <strong>Security Note:</strong> If you authorized this sign-in, no further action is required. If you did not perform this login, please reset your password immediately to protect your account.
          </p>
        </div>
        <div style="border-top: 1px solid #f1f5f9; padding-top: 20px; margin-top: 24px;">
          <p style="font-size: 13px; color: #64748b; margin: 0;">Sincerely,<br><strong style="color: #0f172a;">NexusMart Security Team</strong></p>
        </div>
      </div>
      <div style="background-color: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #f1f5f9; color: #94a3b8; font-size: 12px;">
        <p style="margin: 0 0 4px 0;">© 2026 NexusMart E-Commerce Inc. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendMailHelper({
    to: recipientEmail,
    subject: emailSubject,
    text: textContent,
    html: htmlContent,
    type: 'Login Security Notice',
  });
};

module.exports = { sendLoginNotificationEmail, sendWelcomeEmail, verifyTransporter };
