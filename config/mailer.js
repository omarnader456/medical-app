const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function send2faEmail(toEmail, code) {
  const html = `<p> verification code : <strong>${code}</strong></p>
                <p> code expires in 10 minutes.</p>`;
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: '2FA code',
    html
  });
}

module.exports = { send2faEmail };
