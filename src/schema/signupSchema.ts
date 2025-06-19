import z from 'zod';
export const SignUpSchema = z.object({
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(5),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});