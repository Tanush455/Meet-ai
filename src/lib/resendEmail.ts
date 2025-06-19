import { Resend } from 'resend';
import { VerificationEmail } from '@/components/EmailTemplates/EmailTemplate';
export const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (
    email: string,
    otp: string,
    type: string,
    username: string
  ) => {
    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: "Reset Passoword verification code",
        react: VerificationEmail({ otp, username, type })
      });
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }
  };