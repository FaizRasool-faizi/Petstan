import nodemailer from 'nodemailer';

// Since this is for MVP/Free setup, we'll try to use standard SMTP info from .env,
// otherwise fallback to a generic logging transport (so it won't crash in local dev without credentials).
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER || 'ethereal_user', 
    pass: process.env.SMTP_PASS || 'ethereal_pass', 
  },
});

export const sendWelcomeEmail = async (toEmail: string, name: string) => {
  try {
    // If auth isn't really configured, we'll just log it in dev mode
    if (process.env.SMTP_USER === 'ethereal_user') {
       console.log(`[Mock Email] Welcome email would be sent to ${toEmail}`);
       return true;
    }

    const info = await transporter.sendMail({
      from: '"Petstan Official" <no-reply@petstan.com>',
      to: toEmail,
      subject: 'Welcome to Petstan! 🐾',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e5e5e5; border-radius: 10px;">
          <h2 style="color: #22c55e; border-bottom: 2px solid #22c55e; padding-bottom: 10px;">Welcome to Petstan, ${name}!</h2>
          <p style="font-size: 16px; line-height: 1.5;">We're thrilled to have you join Pakistan's premier pet marketplace.</p>
          <p style="font-size: 16px; line-height: 1.5;">Whether you're looking to buy a new furry friend, or sell pet supplies, you're in the right place.</p>
          <br/>
          <div style="text-align: center; margin: 30px 0;">
             <a href="${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3000'}" style="background-color: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Explore Pets Now</a>
          </div>
          <p style="font-size: 14px; color: #666;">Best regards,<br/><strong>The Petstan Team</strong></p>
        </div>
      `,
    });
    console.log('Welcome email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false; 
  }
};

export const sendOrderConfirmation = async (toEmail: string, orderId: string, amount: number) => {
  try {
    if (process.env.SMTP_USER === 'ethereal_user') {
       console.log(`[Mock Email] Order confirmation would be sent to ${toEmail}`);
       return true;
    }

    const info = await transporter.sendMail({
      from: '"Petstan Orders" <orders@petstan.com>',
      to: toEmail,
      subject: `Order Confirmation - #${orderId} 🐾`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e5e5e5; border-radius: 10px;">
          <h2 style="color: #22c55e; border-bottom: 2px solid #22c55e; padding-bottom: 10px;">Thank you for your order!</h2>
          <p style="font-size: 16px; line-height: 1.5;">Your order <strong>#${orderId}</strong> has been successfully placed and paid.</p>
          <p style="font-size: 16px; line-height: 1.5; background-color: #f3f4f6; padding: 10px; border-radius: 5px;"><strong>Total Amount:</strong> Rs ${amount.toLocaleString()}</p>
          <p style="font-size: 16px; line-height: 1.5;">You can track your order status directly from your dashboard.</p>
          <br/>
          <div style="text-align: center; margin: 30px 0;">
             <a href="${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3000'}/orders" style="background-color: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">View My Orders</a>
          </div>
          <p style="font-size: 14px; color: #666;">Best regards,<br/><strong>The Petstan Team</strong></p>
        </div>
      `,
    });
    console.log('Order confirmation email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return false;
  }
};
