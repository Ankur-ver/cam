// File: frontend/app/dashboard/page.tsx

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface StudentData {
  name: string;
  email: string;
  phone: string;
  codeforcesHandle: string;
  currentRating?: number;
  maxRating?: number;
  lastSynced?: string;
}

export default function Dashboard() {
  const params = useParams();
  const id = params.id as string;

  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        console.log("Fetching student with ID:", id);
        const res = await axios.get(`http://localhost:5000/api/student/${id}`);
        setStudent(res.data);
        console.log(res.data);
      } catch (err) {
        console.error("Error fetching student:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchStudent();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!student) return <div className="text-center mt-10">Student not found</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-4">Welcome, {student.name}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-300">Last updated: {new Date(student.lastSynced || '').toLocaleString()}</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-2">Student Info</h2>
          <ul className="space-y-1">
            <li><strong>Email:</strong> {student.email}</li>
            <li><strong>Phone:</strong> {student.phone}</li>
            <li><strong>CF Handle:</strong> {student.codeforcesHandle}</li>
            <li><strong>Current Rating:</strong> {student.currentRating ?? "N/A"}</li>
            <li><strong>Max Rating:</strong> {student.maxRating ?? "N/A"}</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-2">Performance Snapshot</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[
              { name: "Current", rating: student.currentRating || 0 },
              { name: "Max", rating: student.maxRating || 0 }
            ]}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="rating" fill="#4f46e5" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
