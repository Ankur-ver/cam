
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

interface ContestData {
  contestId: number;
  contestName: string;
  rank: number;
  oldRating: number;
  newRating: number;
  ratingChange: number;
  date: string;
  unsolvedCount: number;
}

interface ProblemStats {
  mostDifficult: number;
  totalSolved: number;
  avgRating: number;
  avgPerDay: number;
  buckets: Record<string, number>;
  heatmap: Record<string, number>;
}

interface StudentData {
  name: string;
  email: string;
  phone: string;
  codeforcesHandle: string;
  currentRating?: number;
  maxRating?: number;
  lastSynced?: string;
  contestHistory?: ContestData[];
  problemStats?: ProblemStats;
  inactivityReminders?:{
    count:number,
    lastReminder:string,
    disabled:boolean,
  },
}

export default function Dashboard() {
  const params = useParams();
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterDays, setFilterDays] = useState(90);
  const id = params.id;

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/student/${id}`);
        setStudent(res.data);
      } catch (err) {
        console.error("Error fetching student:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchStudent();
  }, [id]);

  const filteredContests = student?.contestHistory?.filter(contest => {
    const contestDate = new Date(contest.date);
    const now = new Date();
    const diffDays = (now.getTime() - contestDate.getTime()) / (1000 * 3600 * 24);
    return diffDays <= filterDays;
  });
  const toggleReminderDisabled = async () => {
  try {
    const updatedValue = !student?.inactivityReminders?.disabled;
   const res= await axios.put(`http://localhost:5000/api/student/${id}/reminders`, {
      disabled: updatedValue,
    });
    console.log(res.data)
    setStudent(prev => prev ? {
      ...prev,
      inactivityReminders: {
        ...(prev.inactivityReminders || { count: 0, lastReminder: "", disabled: false }),
        disabled: updatedValue,
      }
    } : null);
  } catch (err) {
    console.error("Failed to update reminder settings:", err);
  }
};

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!student) return <div className="text-center mt-10">Student not found</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-4">Welcome, {student.name}</h1>
      <p><strong>Inactivity Reminders Sent:</strong> {student.inactivityReminders?.count || 0}</p>
<p><strong>Last Reminder Sent:</strong> {student.inactivityReminders?.lastReminder 
  ? new Date(student.inactivityReminders.lastReminder).toLocaleDateString() 
  : "Never"}</p>
<label>
  <input 
    type="checkbox" 
    checked={student.inactivityReminders?.disabled || false}
    onChange={toggleReminderDisabled} 
  />
  Disable Inactivity Emails
</label>
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
          <h2 className="text-xl font-semibold mb-2">Rating Overview</h2>
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
      {student.contestHistory && (
        <div className="mt-10 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Contest History</h2>

          <div className="mb-4">
            <label className="mr-4 font-medium">Filter:</label>
            {[30, 90, 365].map(days => (
              <button
                key={days}
                onClick={() => setFilterDays(days)}
                className={`mr-2 px-3 py-1 rounded-full border ${filterDays === days ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-700 dark:text-white border-gray-400'}`}
              >
                Last {days} days
              </button>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={filteredContests}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="newRating" stroke="#4f46e5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>

          <div className="overflow-x-auto mt-6">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="p-2">Contest</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Rank</th>
                  <th className="p-2">Rating Change</th>
                  <th className="p-2">Unsolved</th>
                </tr>
              </thead>
              <tbody>
                {filteredContests?.map((contest, idx) => (
                  <tr key={idx} className="border-t border-gray-300 dark:border-gray-700">
                    <td className="p-2">{contest.contestName}</td>
                    <td className="p-2">{new Date(contest.date).toLocaleDateString()}</td>
                    <td className="p-2">{contest.rank}</td>
                    <td className="p-2">{contest.ratingChange}</td>
                    <td className="p-2">{contest.unsolvedCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {student.problemStats && (
        <div className="mt-10 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Problem Solving Overview</h2>
          <ul className="mb-4 space-y-1">
            <li><strong>Total Solved:</strong> {student.problemStats.totalSolved}</li>
            <li><strong>Most Difficult Solved:</strong> {student.problemStats.mostDifficult}</li>
            <li><strong>Average Rating:</strong> {Math.round(student.problemStats.avgRating)}</li>
            <li><strong>Average Problems/Day:</strong> {student.problemStats.avgPerDay.toFixed(2)}</li>
          </ul>

          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Problems Solved by Rating</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={Object.entries(student.problemStats.buckets).map(([rating, count]) => ({ rating, count }))}
              >
                <XAxis dataKey="rating" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#16a34a" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
