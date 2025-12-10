import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const sendEmail = async ({ to, subject, text, html }) => {
    try {
        const mailOptions = {
            from: `"${process.env.EMAIL_FROM_NAME || 'OptiStack'}" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};

export default sendEmail;
