import SignIn from '@/components/AuthViews/Sign-in';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

async function Login() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if(!!session){
        redirect("/");
    }
    return (
        <SignIn />
    )
}

export default Login;