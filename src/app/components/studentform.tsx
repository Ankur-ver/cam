/*  Student form */
"use client";

import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface StudentFormProps {
  onSuccess?: () => void;
}

interface StudentFormData {
  name: string;
  email: string;
  phone: string;
  codeforcesHandle: string;
}

export default function StudentForm({ onSuccess }: StudentFormProps) {
 const router=useRouter();
  const [formData, setFormData] = useState<StudentFormData>({
    name: '',
    email: '',
    phone: '',
    codeforcesHandle: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  try {
    const res = await axios.post('https://cozi.onrender.com/api/student', formData);
    const savedStudent = res.data;
    if (onSuccess) onSuccess();
    router.push(`/dashboard/${savedStudent._id}`);
  } catch (err: unknown) {
    console.error('Submission failed:', err);
    if (typeof err === 'object' && err !== null && 'response' in err) {
      const axiosErr = err as {
        response?: { data?: { message?: string } };
      };
      setError(axiosErr.response?.data?.message || 'Submission failed.');
    } else {
      setError('Something went wrong.');
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow w-full max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Add Student</h2>

      {(['name', 'email', 'phone', 'codeforcesHandle'] as (keyof StudentFormData)[]).map((field) => (
        <div className="mb-4" key={field}>
          <label className="block mb-1 text-gray-700 dark:text-gray-200 capitalize" htmlFor={field}>
            {field.replace(/([A-Z])/g, ' $1')}
          </label>
          <input
            id={field}
            name={field}
            type="text"
            value={formData[field]}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
          />
        </div>
      ))}

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
