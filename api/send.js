const nodemailer = require("nodemailer");

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function sanitizeSubject(str) {
  if (!str) return "";
  return String(str).replace(/[\r\n]/g, "").substring(0, 200);
}

const ALLOWED_ORIGINS = [
  "https://69sense.vercel.app",
  "https://www.69sense.com",
  "http://localhost:3000",
];

module.exports = async (req, res) => {
  const origin = req.headers.origin || "";
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, subject, message, topic } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }

  if (!process.env.SMTP_PASS) {
    return res.status(500).json({ error: "Email service not configured." });
  }

  const cleanName = escapeHtml(name).substring(0, 100);
  const cleanEmail = escapeHtml(email).substring(0, 100);
  const cleanSubject = sanitizeSubject(subject);
  const cleanTopic = escapeHtml(topic).substring(0, 50);
  const cleanMessage = escapeHtml(message).substring(0, 5000);

  const topicLabel = cleanTopic || "General Inquiry";

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"69 Sense Website" <${process.env.SMTP_USER}>`,
    to: process.env.SMTP_USER,
    replyTo: email,
    subject: `[69 Sense] ${topicLabel}: ${cleanSubject || cleanName}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#ffffff;padding:30px;border:1px solid #D4A843;">
        <div style="text-align:center;padding-bottom:20px;border-bottom:2px solid #D4A843;">
          <h1 style="color:#D4A843;font-size:24px;margin:0;">69 SENSE</h1>
          <p style="color:#888;font-size:12px;letter-spacing:3px;margin:5px 0 0;">NEW MESSAGE FROM WEBSITE</p>
        </div>
        <div style="padding:25px 0;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:10px 0;color:#888;width:120px;vertical-align:top;">Name:</td>
              <td style="padding:10px 0;color:#fff;font-weight:bold;">${cleanName}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#888;width:120px;vertical-align:top;">Email:</td>
              <td style="padding:10px 0;color:#D4A843;">${cleanEmail}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#888;width:120px;vertical-align:top;">Topic:</td>
              <td style="padding:10px 0;color:#fff;">${topicLabel}</td>
            </tr>
            ${cleanSubject ? `<tr>
              <td style="padding:10px 0;color:#888;width:120px;vertical-align:top;">Subject:</td>
              <td style="padding:10px 0;color:#fff;">${escapeHtml(cleanSubject)}</td>
            </tr>` : ""}
            <tr>
              <td style="padding:10px 0;color:#888;width:120px;vertical-align:top;">Message:</td>
              <td style="padding:10px 0;color:#fff;line-height:1.6;">${cleanMessage.replace(/\n/g, "<br>")}</td>
            </tr>
          </table>
        </div>
        <div style="text-align:center;padding-top:20px;border-top:1px solid #333;">
          <p style="color:#888;font-size:11px;">Sent from 69sense.vercel.app contact form</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to send email. Please try again." });
  }
};
