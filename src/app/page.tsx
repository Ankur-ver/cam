
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
export default function Home() {
  const router = useRouter();
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-200 via-white to-cyan-100 flex flex-col justify-center items-center text-center px-4">
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-indigo-700 drop-shadow-lg">
          COZI
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-500 animate-gradient">
            Welcomes You !
          </span>
        </h1>
        <p className="mt-4 text-lg text-gray-700 max-w-xl mx-auto">
          Get your codeforces preparation next level ! with
          <b> COZI</b>
          , Advanced student codeforces details management system
        </p>
      </div>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <Image
          src="/images/undraw_instant-analysis_vm8x.svg"
          alt="Animated"
          width={500}
          height={400}
          className="mb-10"
        />
      </motion.div>
      <button
        onClick={() => router.push("/login")}
        className="bg-red-500 hover:bg-red-600 text-white text-lg py-3 px-8 rounded-full shadow-xl hover:shadow-2xl transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300"
      >
        Get Started
      </button>
    </main>
  );
}


