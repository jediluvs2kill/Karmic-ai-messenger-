import React, { useState } from 'react';

interface OnboardingProps {
  onUserSetup: (name: string, job: string) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onUserSetup }) => {
  const [name, setName] = useState('');
  const [job, setJob] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && job.trim()) {
      onUserSetup(name.trim(), job.trim());
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-wa-dark-secondary">
      <div className="w-full max-w-md p-8 space-y-8 bg-wa-dark rounded-lg shadow-lg">
        <div>
          <h2 className="text-3xl font-extrabold text-center text-gray-100">Welcome to P2P Messenger</h2>
          <p className="mt-2 text-center text-gray-400">Please tell us a bit about yourself to get started.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm">
            <div className="mb-4">
              <label htmlFor="name" className="sr-only">Your Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="relative block w-full px-3 py-3 text-white placeholder-gray-500 bg-wa-dark-secondary border border-gray-700 appearance-none rounded-md focus:outline-none focus:ring-wa-teal focus:border-wa-teal focus:z-10 sm:text-sm"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="job" className="sr-only">Job Title</label>
              <input
                id="job"
                name="job"
                type="text"
                required
                className="relative block w-full px-3 py-3 text-white placeholder-gray-500 bg-wa-dark-secondary border border-gray-700 appearance-none rounded-md focus:outline-none focus:ring-wa-teal focus:border-wa-teal focus:z-10 sm:text-sm"
                placeholder="Your Job Title (e.g., Software Engineer)"
                value={job}
                onChange={(e) => setJob(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="relative flex justify-center w-full px-4 py-3 text-sm font-medium text-white border border-transparent rounded-md group bg-wa-teal hover:bg-wa-teal-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-wa-dark focus:ring-wa-teal"
            >
              Get Started
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
