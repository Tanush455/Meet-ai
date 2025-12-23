import Home from '@/components/client-components/HomeView'
import { auth } from '@/lib/auth'
import { caller } from '@/trpc/server';
import { headers } from 'next/headers'
import { redirect } from 'next/navigation';

async function page() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if(!session){
      redirect("/login")
    }
    
    return (
      <div>
        <Home/>
      </div>
    )
  } catch (error) {
    console.error('Error in dashboard page:', error);
    
    // If it's a database connection error, show a user-friendly message
    if (error instanceof Error && error.message.includes('Can\'t reach database server')) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Database Connection Error</h1>
            <p className="text-gray-600 mb-4">
              Unable to connect to the database. Please check your database configuration.
            </p>
            <p className="text-sm text-gray-500">
              Make sure your DATABASE_URL environment variable is properly set.
            </p>
          </div>
        </div>
      );
    }
    
    // For other errors, redirect to login
    redirect("/login");
  }
}

export default page