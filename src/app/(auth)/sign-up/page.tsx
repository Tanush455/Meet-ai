import SignUpView from '@/components/AuthViews/Sign-up';
import { Card } from '@/components/ui/card';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

async function SignUp() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if(!!session){
        redirect("/")
    }
    return (
        <SignUpView/>
    )
}

export default SignUp;