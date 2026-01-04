import nodemailer from 'nodemailer';

let transporter: any = null;

export function initializeEmailService() {
  try {
    const emailHost = process.env.EMAIL_HOST;
    const emailPort = process.env.EMAIL_PORT;
    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASSWORD;

    if (!emailHost || !emailPort || !emailUser || !emailPassword) {
      // console.warn('⚠️ Email credentials not configured. OTP emails will not be sent.');
      return false;
    }

    transporter = nodemailer.createTransport({
      host: emailHost,
      port: parseInt(emailPort, 10),
      secure: parseInt(emailPort, 10) === 465,
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });

    console.log('✅ Email service initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Email service initialization failed:', error);
    return false;
  }
}

export async function sendOTPEmail(email: string, otp: string): Promise<boolean> {
  if (!transporter) {
    console.warn('Email service not initialized. Skipping OTP email.');
    return false;
  }

  try {
    const mailOptions = {
      from: `"Meow Meow Pet Shop" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Verification Code - Meow Meow Pet Shop',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verification Code</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #26732D 0%, #FFC107 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🐾 Meow Meow Pet Shop</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <h2 style="color: #26732D; margin-top: 0;">Your Verification Code</h2>
            
            <p style="font-size: 16px; color: #555;">
              Thank you for signing up with Meow Meow Pet Shop! To complete your registration, please use the verification code below:
            </p>
            
            <div style="background: white; border: 2px solid #26732D; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
              <p style="margin: 0; color: #888; font-size: 14px; margin-bottom: 10px;">YOUR VERIFICATION CODE</p>
              <p style="margin: 0; font-size: 36px; font-weight: bold; color: #26732D; letter-spacing: 8px;">${otp}</p>
            </div>
            
            <p style="font-size: 14px; color: #888; margin-top: 25px;">
              This code will expire in <strong>10 minutes</strong>.
            </p>
            
            <p style="font-size: 14px; color: #888;">
              If you didn't request this code, please ignore this email.
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">
              © 2025 Meow Meow Pet Shop. All rights reserved.<br>
              Your trusted pet supply store.
            </p>
          </div>
        </body>
        </html>
      `,
      text: `Your Meow Meow Pet Shop verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please ignore this email.`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send OTP email:', error);
    return false;
  }
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
