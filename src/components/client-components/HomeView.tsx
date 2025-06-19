"use client"
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation";

export default function Home() {

  const {
    data: session,
    isPending
  } = authClient.useSession();

  if (session) {
    console.log(session.user);
  }
  const router = useRouter();
  return (
    <div className="w-full min-h-screen p-4">
      {session ? (
        <>
          <Button onClick={async() => {
            await authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  router.push("/login")
                }
              }
            })
          }}>
            Logout
          </Button>
        </>
      ) : (
        <>
          <Link href={'/login'}>
            <Button
              variant="outline"
              className="bg-transparent text-white hover:bg-white/10 border-white"
            >
              Login
            </Button>
          </Link>
          <Link href={'/sign-up'}>
            <Button className="bg-white text-green-600 hover:bg-gray-100">
              Sign Up
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}
