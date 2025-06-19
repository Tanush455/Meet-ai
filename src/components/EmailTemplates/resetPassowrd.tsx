"use client"
import React, { useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { verifyOTP, resetPassword, sendOtpToemail } from '@/action/SendOtp';
import { authClient } from '@/lib/auth-client';

const otpSchema = z.object({
  otp: z.string().length(6, { message: 'OTP must be 6 digits' }),
  newPassword: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

const ResetPasswordOtpVerification = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
      newPassword: '',
      confirmPassword: ''
    },
  });
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Check if email exists in localStorage on component mount
  useEffect(() => {
    const email = localStorage.getItem('resetEmail');
    if (!email) {
      toast.error('Please enter your email first');
      router.replace('/emailverify');
    }
  }, [router]);

  const onSubmit = async (data: z.infer<typeof otpSchema>) => {
    try {
      setIsLoading(true);
      const email = localStorage.getItem('resetEmail');
      
      if (!email) {
        toast.error('Email not found. Please try again.');
        router.replace('/emailverify');
        return;
      }

      // First verify the OTP
      const verifyResult = await verifyOTP(email, data.otp);

      if (verifyResult.error) {
        toast.error(verifyResult.error);
        return;
      }

      if (!verifyResult.resetToken) {
        toast.error('Invalid reset token');
        return;
      }

      // If OTP is verified, update the password
      const { error: resetError } = await authClient.resetPassword({
        newPassword: data.newPassword,
        token: verifyResult.resetToken
      });

      if (resetError) {
        toast.error(resetError.message || 'Failed to reset password');
        return;
      }

      toast.success('Password reset successful');
      localStorage.removeItem('resetEmail');
      router.push('/login');
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Reset password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsLoading(true);
      const email = localStorage.getItem('resetEmail');
      
      if (!email) {
        toast.error('Email not found. Please try again.');
        router.replace('/emailverify');
        return;
      }

      const result = await sendOtpToemail(email);

      if (result === "no user found") {
        toast.error('No account found with this email address');
        return;
      }

      if (result === "Error sending OTP") {
        toast.error('Failed to send OTP. Please try again later.');
        return;
      }

      if (result === "success") {
        toast.success('OTP resent successfully');
      }
    } catch (error) {
      toast.error('Failed to resend OTP');
      console.error('Resend OTP error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (index: number, value: string) => {
    const currentOtp = form.getValues('otp');
    const newOtp = currentOtp.substring(0, index) + value + currentOtp.substring(index + 1);
    
    form.setValue('otp', newOtp, { shouldValidate: true });
    
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !form.getValues('otp')[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
      <p className="text-gray-600 mb-6 text-center">
        Please enter the 6-digit OTP to reset your password
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="otp"
            render={() => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <div className="flex space-x-2 justify-center">
                    {[...Array(6)].map((_, index) => (
                      <Input
                        key={index}
                        type="text"
                        maxLength={1}
                        autoFocus={index === 0}
                        ref={(el) => void (inputRefs.current[index] = el)}
                        className="w-12 h-12 text-center text-xl"
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                      />
                    ))}
                  </div>
                </FormControl>
                <FormMessage className="text-center" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter new password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Confirm new password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Reset Password'}
          </Button>
          
          <div className="text-center mt-4">
            <button 
              type="button"
              className="text-blue-600 hover:underline"
              onClick={handleResendOtp}
              disabled={isLoading}
            >
              Resend OTP
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ResetPasswordOtpVerification;