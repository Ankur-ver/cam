/*Admin Dashboard page*/

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaSearch, FaEdit, FaTrash, FaPlus, FaDownload } from "react-icons/fa";

interface Student {
  _id: string;
  name: string;
  email: string;
  codeforcesHandle: string;
  currentRating?: number;
  maxRating?: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/student");     //API direct hit to all student fetches all stduents
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/student/${id}`);     //Fetch individual student
      setStudents((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const downloadCSV = () => {
    const headers = ["Name", "Email", "Codeforces Handle", "Current Rating", "Max Rating"];
    const rows = students.map((s) => [
      s.name,
      s.email,
      s.codeforcesHandle,
      s.currentRating ?? "N/A",
      s.maxRating ?? "N/A",
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = "students.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.codeforcesHandle.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto text-gray-800 dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-indigo-600">Admin Dashboard</h1>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/student")}
            className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
          >
            <FaPlus /> Add Student
          </button>

          {/* CV download */}
          <button
            onClick={downloadCSV}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          >
            <FaDownload /> Download CSV                
          </button>           
        </div>
      </div>

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
              <th className="p-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s, idx) => (
              <tr
                key={s._id}
                className={`border-t dark:border-gray-700 ${
                  idx % 2 === 0 ? "bg-gray-50 dark:bg-gray-900" : ""
                } hover:bg-indigo-50 dark:hover:bg-indigo-400 transition-all`}
              >
                <td
                  className="p-4 text-yellow-600 hover:underline cursor-pointer"
                  onClick={() => router.push(`/dashboard/${s._id}`)}
                >
                  {s.name}
                </td>
                <td className="p-4">{s.email}</td>
                <td className="p-4 font-mono text-indigo-600 dark:text-indigo-300">
                  {s.codeforcesHandle}
                </td>
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
                <td className="p-4 text-center flex justify-center gap-3">
                  <button
                    onClick={() => router.push(`/dashboard/edit/${s._id}`)}
                    className="text-yellow-500 hover:text-yellow-600"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(s._id)}
                    className="text-red-500 hover:text-red-600"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
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
