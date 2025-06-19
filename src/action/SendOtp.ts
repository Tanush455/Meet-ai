"use server"
import { sendVerificationEmail } from "@/lib/resendEmail";
import prisma from "@/utils/prismaClient"
import { redirect } from "next/navigation";

export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export const sendOtpToemail = async(email:string) => {
    try {
        const user = await prisma.user.findUnique({
            where:{
                email
            }
        });

        if(!user || !user.email || !user.name){
            return "no user found";
        }
        else{
            const otp = generateOTP();
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

            await prisma.verification.create({
                data: {
                    identifier: email,
                    value: otp,
                    expiresAt
                }
            });

            await sendVerificationEmail(user.email, otp, "reset", user.name);
            return "success";
        }
    } catch (error) {
        console.error('Error sending OTP:', error);
        return "Error sending OTP";
    }
}

export const verifyOTP = async(email: string, otp: string) => {
    try {
        const verification = await prisma.verification.findFirst({
            where: {
                identifier: email,
                value: otp,
                expiresAt: {
                    gt: new Date()
                }
            }
        });

        if (!verification) {
            return { error: "Invalid or expired OTP" };
        }

        // Delete the used OTP
        await prisma.verification.delete({
            where: {
                id: verification.id
            }
        });

        return { 
            success: true,
            resetToken: otp 
        };
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return { error: "Error verifying OTP" };
    }
}

export const resetPassword = async(email: string, newPassword: string, resetToken: string) => {
    try {
        // Get the user's account
        const user = await prisma.user.findUnique({
            where: { email },
            include: { accounts: true }
        });

        if (!user || !user.accounts[0]) {
            return { error: "User account not found" };
        }

        // Update the user's password
        await prisma.account.update({
            where: { 
                id: user.accounts[0].id
            },
            data: { password: newPassword }
        });

        return { success: true };

    } catch (error) {
        console.error('Error resetting password:', error);
        return { error: "Error resetting password" };
    }
}