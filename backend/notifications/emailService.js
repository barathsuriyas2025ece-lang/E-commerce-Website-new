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
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #0f172a;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #f1f5f9;">
        <h1 style="color: #4f46e5; margin: 0; font-size: 26px;">Nexus<span style="color: #0f172a;">Mart</span></h1>
        <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Enterprise AI-Powered E-Commerce Platform</p>
      </div>

      <div style="padding: 24px 0; color: #0f172a;">
        <h2 style="color: #0f172a; font-size: 20px; margin-bottom: 12px;">Welcome aboard, ${name || 'Customer'}! 👋</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 16px;">
          Thank you for creating an account with <strong>NexusMart E-Commerce</strong>. We're thrilled to have you!
        </p>

        <div style="background-color: #f0fdf4; padding: 16px; border-radius: 12px; border: 1px solid #bbf7d0; margin: 20px 0;">
          <p style="margin: 4px 0; font-size: 14px; color: #166534;"><strong>🎁 Welcome Reward:</strong> You earned <strong>100 Loyalty Points</strong> on registration!</p>
          <p style="margin: 4px 0; font-size: 13px; color: #15803d;"><strong>Account Email:</strong> ${recipientEmail}</p>
        </div>

        <p style="font-size: 14px; line-height: 1.6; color: #334155;">
          You can now browse our tech catalog, track orders in real-time, and ask our <strong>Floating AI Assistant</strong> to help you find products under your budget or apply coupons.
        </p>
      </div>

      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #f1f5f9; color: #94a3b8; font-size: 12px;">
        <p>© 2026 NexusMart E-Commerce Inc. All rights reserved.</p>
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

const sendLoginNotificationEmail = async ({ name, email, time = new Date().toLocaleString() }) => {
  const recipientEmail = email;
  if (!recipientEmail) return;

  const emailSubject = `🔐 Security Alert: Successful Sign-In to NexusMart E-Commerce`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #0f172a;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #f1f5f9;">
        <h1 style="color: #4f46e5; margin: 0; font-size: 24px;">Nexus<span style="color: #0f172a;">Mart</span></h1>
        <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Enterprise AI E-Commerce Platform</p>
      </div>

      <div style="padding: 24px 0; color: #0f172a;">
        <h2 style="color: #0f172a; font-size: 18px; margin-bottom: 12px;">Hello ${name || 'Customer'},</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 16px;">
          You have successfully signed in to your <strong>NexusMart E-Commerce account</strong>.
        </p>

        <div style="background-color: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0; margin: 20px 0;">
          <p style="margin: 6px 0; font-size: 13px; color: #334155;"><strong>Account Email:</strong> ${recipientEmail}</p>
          <p style="margin: 6px 0; font-size: 13px; color: #334155;"><strong>Sign-In Time:</strong> ${time}</p>
          <p style="margin: 6px 0; font-size: 13px; color: #16a34a;"><strong>Security Status:</strong> Authenticated & Active</p>
        </div>

        <p style="font-size: 12px; color: #64748b; line-height: 1.5;">
          If this sign-in was authorized by you, no further action is required. If you did not recognize this login activity, please change your password immediately.
        </p>
      </div>

      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #f1f5f9; color: #94a3b8; font-size: 12px;">
        <p>© 2026 NexusMart E-Commerce Inc. All rights reserved.</p>
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
