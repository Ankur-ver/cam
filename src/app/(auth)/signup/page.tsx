/*Signup page */
'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from 'axios';
import axios from 'axios';

export default function Signup(){
   const router=useRouter();
 const [email,setemail]=useState('');
 const [name,setname]=useState('');
 const [password,setpassword]=useState('');
 const [role,setrole]=useState('student');
 const [error,seterror]=useState('');
{/*Signup Handle */}
 const handleSignup=async(e:React.FormEvent)=>{
   e.preventDefault();
   try {
    await axios.post('http://localhost:5000/api/auth/signup',{email,password,name,role});
    router.push('/login');
   } catch (err:unknown) {
     const error = err as AxiosError<{ message?: string }>;
      seterror(error.response?.data?.message || 'signup failed');
   }
 };
 {/*Signup UI */}
 return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <form onSubmit={handleSignup} className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">Create Your Account</h2>
        {error && <p className="text-red-500 mb-4 text-sm text-center">{error}</p>}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setname(e.target.value)}
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Register as</label>
          <select
            value={role}
            onChange={(e) => setrole(e.target.value)}
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition duration-200"
        >
          Sign Up
        </button>
        <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
          Already have an account? <a href="/login" className="text-green-600 hover:underline">Login</a>
        </p>
      </form>
    </div>
  );
}