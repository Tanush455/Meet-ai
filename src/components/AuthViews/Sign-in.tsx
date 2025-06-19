"use client"
import { Card, CardContent } from '@/components/ui/card';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SignInSchema } from '@/schema/loginSchema';
import { Alert, AlertTitle } from '../ui/alert';
import { Loader, OctagonAlert } from 'lucide-react';
import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { error } from 'console';

function SignIn() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState<boolean | undefined>(false);

    const form = useForm<z.infer<typeof SignInSchema>>({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const onSubmit = async (data: z.infer<typeof SignInSchema>) => {
        setError(null);
        setPending(true);
        const { error } = await authClient.signIn.email({
            email: data.email,
            password: data.password,
            callbackURL: "/"
        }, {
            onSuccess: () => {
                setPending(false);
            },
            onError: (error) => {
                setPending(false);
                setError(error.error.message);
            }
        });
    }

    const onSocial = async (provider: "github" | "google") => {
        setError(null);
        setPending(true);

        authClient.signIn.social({
            provider: `${provider}`,
            callbackURL: "/"
        }, {
            onSuccess: () => {
                setPending(false);
            },
            onError: (error) => {
                setPending(false);
                setError(error.error.message);
            }
        });
    }

    return (
        <div className=' flex flex-col gap-6'>
            <Card className='overflow-hidden p-0'>
                <CardContent className='grid p-0 md:grid-cols-2'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='p-6 md:p-8'>
                            <div className='flex flex-col gap-6'>
                                <div className='flex flex-col items-center text-center'>
                                    <h1 className='text-2xl font-bold'>
                                        Welcome back
                                    </h1>
                                    <p className='text-muted-foreground text-balance'>
                                        Login to your account
                                    </p>
                                </div>
                                <div className='grid gap-3'>
                                    <FormField
                                        control={form.control}
                                        name='email'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder='email' {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )} />

                                    <FormField
                                        control={form.control}
                                        name='password'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input placeholder='**********' {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                </div>

                                <div className='text-right'>
                                    <Button
                                        variant="link"
                                        className='text-blue-600 px-0'
                                    >
                                        <Link href="/emailverify">Forgot Password?</Link>
                                    </Button>
                                </div>
                                {
                                    !!error && (
                                        <Alert className='bg-destructive/10 border-none'>
                                            <OctagonAlert className='h-4 w-4 !text-destructive' />
                                            <AlertTitle>{error}</AlertTitle>
                                        </Alert>
                                    )
                                }

                                {pending ? <Loader className='mx-auto' /> : <Button type='submit' className='w-full' disabled={pending}>Login</Button>}
                                <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2
                                after:z-0 after:flex after:items-center after:border-t'>
                                    <span className='bg-card text-muted-foreground relative z-10 px-2'>
                                        Or Continue to
                                    </span>
                                </div>

                                <div className='grid grid-cols-2 gap-4'>
                                    <Button
                                        disabled={pending}
                                        variant="outline"
                                        type='button'
                                        className='w-full'
                                        onClick={() => onSocial("google")}>
                                        <FaGoogle className="mr-2" /> Google
                                    </Button>
                                    <Button
                                        disabled={pending}
                                        variant="outline"
                                        type='button'
                                        className='w-full'
                                        onClick={() => onSocial("github")}>
                                        <FaGithub className="mr-2" /> GitHub
                                    </Button>
                                </div>

                                <div className='text-center text-sm'>
                                    Dont&apos; have an account?{" "}<Link href={'/sign-up'} className='text-blue-600 underline underline-offset-4'>Sign Up</Link>
                                </div>
                            </div>
                        </form>
                    </Form>


                    <div className='bg-radial from-sidebar-accent to-sidebar relative hidden md:flex flex-col 
                    gap-y-4 items-center justify-center'>
                        <img src="/download-removebg-preview.png" alt="Image" className='h-[92px] w-[92px]' />
                        <p className='text-2xl font-semibold text-white'>
                            Nova AI
                        </p>
                    </div>
                </CardContent>
            </Card>

            <div className='text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4'>
                By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </div>
        </div>
    )
}

export default SignIn;