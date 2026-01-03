import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // 16-character App Password
    },
  });

  const mailOptions = {
    from: `"Your Store Name" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.message, 
  };

  try {
    await transporter.verify();
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to: ${options.email}`);
  } catch (error) {
    console.error('Nodemailer Error:', error.message);
    throw error; 
  }
};

export default sendEmail;