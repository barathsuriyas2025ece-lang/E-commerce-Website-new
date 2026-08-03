const nodemailer = require('nodemailer');

/**
 * Creates an SMTP Transporter for sending real email notifications.
 * Uses environment credentials if available, or falls back to an Ethereal/Test transporter.
 */
const createTransporter = async () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';

  if (user && pass) {
    const isGmail = host.includes('gmail') || process.env.SMTP_SERVICE === 'gmail';
    if (isGmail) {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass },
        tls: { rejectUnauthorized: false },
      });
    }
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
    });
  }

  // Auto-generate test account if process.env.SMTP_USER is empty
  try {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } catch (err) {
    return null;
  }
};

const sendWelcomeEmail = async ({ name, email }) => {
  const recipientEmail = email;
  if (!recipientEmail) return;

  const emailSubject = `🎉 Welcome to NexusMart E-Commerce, ${name || 'Valued Customer'}!`;
  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #0f172a; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
      
      <!-- Top Brand Header -->
      <div style="background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 800; tracking: -0.5px; color: #ffffff;">Nexus<span style="color: #6366f1;">Mart</span></h1>
        <p style="margin: 6px 0 0 0; font-size: 13px; color: #e0e7ff; font-weight: 500;">Official Welcome & Account Confirmation</p>
      </div>

      <!-- Main Body Content -->
      <div style="padding: 32px 28px; color: #0f172a;">
        <h2 style="color: #0f172a; font-size: 22px; margin-top: 0; margin-bottom: 16px; font-weight: 700;">Welcome aboard, ${name || 'Customer'}! 👋</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 20px;">
          Thank you for signing up with <strong>NexusMart E-Commerce</strong>. Your account has been registered successfully and is ready for use.
        </p>

        <!-- Reward Banner -->
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 12px; border: 1px solid #bbf7d0; margin: 24px 0;">
          <p style="margin: 0 0 8px 0; font-size: 15px; color: #166534; font-weight: 700;">🎁 Welcome Bonus Unlocked!</p>
          <p style="margin: 0 0 4px 0; font-size: 13px; color: #15803d;">You earned <strong>100 Loyalty Points</strong> automatically credited to your account.</p>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #166534;"><strong>Registered Email:</strong> <code>${recipientEmail}</code></p>
        </div>

        <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 24px;">
          Explore our wide range of products, track orders live, and make use of our <strong>AI Assistant</strong> for personalized shopping recommendations.
        </p>

        <div style="border-top: 1px solid #f1f5f9; pt: 20px; margin-top: 24px;">
          <p style="font-size: 13px; color: #64748b; margin: 0;">Warm regards,<br><strong style="color: #0f172a;">NexusMart Team</strong></p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #f1f5f9; color: #94a3b8; font-size: 12px;">
        <p style="margin: 0 0 4px 0;">© 2026 NexusMart E-Commerce Inc. All rights reserved.</p>
        <p style="margin: 0; color: #cbd5e1;">This is an automated system email.</p>
      </div>
    </div>
  `;

  try {
    const transporter = await createTransporter();
    if (!transporter) return { success: false };

    const mailOptions = {
      from: `"NexusMart E-Commerce" <${process.env.SMTP_USER || 'no-reply@nexusmart.com'}>`,
      to: recipientEmail,
      subject: emailSubject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    const testUrl = nodemailer.getTestMessageUrl(info);
    if (testUrl) {
      console.log(`📧 [TEST EMAIL DISPATCHED] View email preview at: ${testUrl}`);
    } else {
      console.log(`📧 [REAL EMAIL DISPATCHED] To: ${recipientEmail} | MessageId: ${info.messageId}`);
    }
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`⚠️ Email Dispatch Error: ${error.message}`);
    return { success: false, error: error.message };
  }
};

const sendLoginNotificationEmail = async ({ name, email, time = new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' }) }) => {
  const recipientEmail = email;
  if (!recipientEmail) return;

  const emailSubject = `🔐 Security Notification: Successful Sign-In to NexusMart`;

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #0f172a; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
      
      <!-- Top Brand Header -->
      <div style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #ffffff;">Nexus<span style="color: #818cf8;">Mart</span></h1>
        <p style="margin: 6px 0 0 0; font-size: 13px; color: #c7d2fe; font-weight: 500;">Account Sign-In Security Notice</p>
      </div>

      <!-- Main Content -->
      <div style="padding: 32px 28px; color: #0f172a;">
        <h2 style="color: #0f172a; font-size: 20px; margin-top: 0; margin-bottom: 12px; font-weight: 700;">Hello ${name || 'Valued Customer'},</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 20px;">
          This email confirms that you recently signed in to your <strong>NexusMart E-Commerce</strong> account.
        </p>

        <!-- Activity Summary Table -->
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; margin: 24px 0;">
          <h3 style="margin: 0 0 14px 0; font-size: 14px; color: #1e293b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Sign-In Details</h3>
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
              <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Access Method:</td>
              <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">Web Sign-In (Authenticated)</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Session Status:</td>
              <td style="padding: 6px 0; font-weight: 700; color: #16a34a;">Active & Secure</td>
            </tr>
          </table>
        </div>

        <!-- Security Advice -->
        <div style="background-color: #eff6ff; padding: 16px 20px; border-radius: 12px; border-left: 4px solid #3b82f6; margin-bottom: 24px;">
          <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #1e40af;">
            <strong>Security Note:</strong> If you authorized this sign-in, no further action is required. If you did not perform this login, please update your account password immediately to maintain account safety.
          </p>
        </div>

        <div style="border-top: 1px solid #f1f5f9; padding-top: 20px; margin-top: 24px;">
          <p style="font-size: 13px; color: #64748b; margin: 0;">Sincerely,<br><strong style="color: #0f172a;">NexusMart Security & Operations Team</strong></p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #f1f5f9; color: #94a3b8; font-size: 12px;">
        <p style="margin: 0 0 4px 0;">© 2026 NexusMart E-Commerce Inc. All rights reserved.</p>
        <p style="margin: 0; color: #cbd5e1;">This security notice was sent to ${recipientEmail}</p>
      </div>
    </div>
  `;

  try {
    const transporter = await createTransporter();
    if (!transporter) return { success: false };

    const mailOptions = {
      from: `"NexusMart Security" <${process.env.SMTP_USER || 'no-reply@nexusmart.com'}>`,
      to: recipientEmail,
      subject: emailSubject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    const testUrl = nodemailer.getTestMessageUrl(info);
    if (testUrl) {
      console.log(`📧 [TEST EMAIL DISPATCHED] View email preview at: ${testUrl}`);
    } else {
      console.log(`📧 [REAL EMAIL DISPATCHED] To: ${recipientEmail} | MessageId: ${info.messageId}`);
    }
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`⚠️ Email Dispatch Error: ${error.message}`);
    return { success: false, error: error.message };
  }
};

module.exports = { sendLoginNotificationEmail, sendWelcomeEmail };
