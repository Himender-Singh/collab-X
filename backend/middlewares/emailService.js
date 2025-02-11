import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER,  // Your email address
    pass: process.env.EMAIL_PASS,  // Your email password or app password
  },
});

export const sendEmail = async (to, subject, message) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Your email address
    to,                           // Recipient's email address
    subject,                      // Email subject
    html: message,                // HTML message content
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
