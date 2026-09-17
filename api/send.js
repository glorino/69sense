const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
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

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.hostinger.com",
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER || "info@69sense.com",
      pass: process.env.SMTP_PASS,
    },
  });

  const topicLabel = topic || "General Inquiry";

  const mailOptions = {
    from: `"69 Sense Website" <${process.env.SMTP_USER || "info@69sense.com"}>`,
    to: process.env.SMTP_USER || "info@69sense.com",
    replyTo: email,
    subject: `[69 Sense] ${topicLabel}: ${subject || name}`,
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
              <td style="padding:10px 0;color:#fff;font-weight:bold;">${name}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#888;width:120px;vertical-align:top;">Email:</td>
              <td style="padding:10px 0;color:#D4A843;">${email}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#888;width:120px;vertical-align:top;">Topic:</td>
              <td style="padding:10px 0;color:#fff;">${topicLabel}</td>
            </tr>
            ${subject ? `<tr>
              <td style="padding:10px 0;color:#888;width:120px;vertical-align:top;">Subject:</td>
              <td style="padding:10px 0;color:#fff;">${subject}</td>
            </tr>` : ""}
            <tr>
              <td style="padding:10px 0;color:#888;width:120px;vertical-align:top;">Message:</td>
              <td style="padding:10px 0;color:#fff;line-height:1.6;">${message.replace(/\n/g, "<br>")}</td>
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
    console.error("Email error:", error);
    return res.status(500).json({ error: "Failed to send email. Please try again." });
  }
};
