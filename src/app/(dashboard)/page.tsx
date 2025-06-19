import Home from '@/components/client-components/HomeView'
import { auth } from '@/lib/auth'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation';

async function page() {
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
}

export default page