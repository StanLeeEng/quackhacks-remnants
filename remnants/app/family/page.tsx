"use client"
import { Navbar } from '@/components/navbar'
import { useState } from 'react';

export default function JoinTeamPage() {
  const [code, setCode] = useState('');

  const createTeam = () => {
    // Replace with your join logic
    console.log(`Joining team with code: ${code}`);
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen pt-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center">Welcome</h1>
        <p className="font-bold mb-4 text-center">Join or create your family!</p>
        <div className='flex gap-2 mb-4'>
            <input
                type="text"
                placeholder="Enter team code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <button
                onClick={createTeam}
                className="px-5 py-2 rounded-md bg-indigo-600 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
                Join
            </button>
        </div>
        <p className="mb-2 text-center">or</p>
        <div className='flex justify-center'>
            <button
                onClick={createTeam}
                className="items-center rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
                Create Family
            </button>
        </div>   
      </div>
    </div>
    </>
  );
}