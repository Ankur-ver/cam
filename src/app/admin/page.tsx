"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaSearch } from "react-icons/fa";

interface Student {
  _id: string;
  name: string;
  email: string;
  codeforcesHandle: string;
  currentRating?: number;
  maxRating?: number;
}

export default function AdminDashboard() {
  const router=useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/student");
        setStudents(res.data);
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.codeforcesHandle.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto text-gray-800 dark:text-white">
      <h1 className="text-4xl font-bold mb-6 text-indigo-600">Admin Dashboard</h1>

      <div className="mb-4 flex items-center gap-2">
        <FaSearch className="text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or handle..."
          className="w-full max-w-md px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white dark:bg-gray-900"
        />
      </div>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-white text-left">
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Handle</th>
              <th className="p-4 font-semibold">Current Rating</th>
              <th className="p-4 font-semibold">Max Rating</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s, idx) => (
              <tr
                key={s._id}
                className={`border-t dark:border-gray-700 ${
                  idx % 2 === 0 ? "bg-gray-50 dark:bg-gray-900" : ""
                } hover:bg-indigo-50 dark:hover:bg-indigo-800 transition-all`}
              >
                <td
  className="p-4 text-blue-600 hover:underline cursor-pointer"
  onClick={() => router.push(`/student/${s._id}`)}
>
  {s.name}
</td>
                <td className="p-4">{s.email}</td>
                <td className="p-4 font-mono text-indigo-600 dark:text-indigo-300">{s.codeforcesHandle}</td>
                <td className="p-4">
                  {s.currentRating ? (
                    <span className="px-2 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                      {s.currentRating}
                    </span>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="p-4">
                  {s.maxRating ? (
                    <span className="px-2 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                      {s.maxRating}
                    </span>
                  ) : (
                    "N/A"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredStudents.length === 0 && (
          <div className="p-6 text-center text-gray-500 dark:text-gray-300">
            No matching students found.
          </div>
        )}
      </div>
    </div>
  );
}
