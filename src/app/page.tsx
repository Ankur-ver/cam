'use client'

import Image from "next/image";
import { useRouter } from "next/navigation";
export default function Home() {
  const router=useRouter();
  return (
    <main className="text-center mt-10 text-3xl text-blue-500">
      Welcome to Student Management System
      <br/>
      <button
  className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-300 active:scale-95"
  onClick={() => router.push('/login')}
>
  Login
</button>
    </main>
  );
}
