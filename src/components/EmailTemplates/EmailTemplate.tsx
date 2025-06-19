import { Html, Head, Body, Container, Section, Heading, Text, Button } from '@react-email/components';
import { username } from 'better-auth/plugins/username';

interface VerificationEmailProps {
  otp: string;
  type: string;
  username: string
}

export const VerificationEmail = ({ otp,username, type }: VerificationEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Section style={content}>
          <Heading style={h1}>
            Reset Your Password
          </Heading>
          <Text style={paragraph}>{username}</Text>
          <Text style={paragraph}>
            Your one-time verification code is:
          </Text>
          
          <Text style={code}>{otp}</Text>
          
          <Text style={paragraph}>
            This code will expire in 10 minutes. If you didn't request this, please ignore this email.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Inter, sans-serif',
};

const container = {
  padding: '20px',
  maxWidth: '600px',
  margin: '0 auto',
};

const content = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '40px',
};

const h1 = {
  fontSize: '24px',
  fontWeight: '600',
  marginBottom: '30px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.5',
  color: '#333',
};

const code = {
  display: 'inline-block',
  padding: '16px 24px',
  backgroundColor: '#f0f0f0',
  borderRadius: '6px',
  fontSize: '24px',
  fontWeight: '700',
  margin: '20px 0',
};