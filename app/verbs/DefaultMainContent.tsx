import React from 'react';
import Link from 'next/link';

export default function DefaultMainContent({ user }: { user?: any }) {
  return (
    <section className="mx-auto max-w-3xl px-6 py-10">
      <header className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Master Spanish Verbs Faster
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          {user 
            ? "Welcome back! Select a verb from the sidebar to explore its conjugations."
            : "Explore full conjugations, practice with quick quizzes, and save favorites for rapid review."
          }
        </p>
      </header>

      {/* Feature highlights */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <h3 className="font-semibold">Full Conjugations</h3>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {user 
              ? "Browse all tenses and moods for any verb."
              : "Indicative, subjunctive, imperative, and more in one place."
            }
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
            </svg>
            <h3 className="font-semibold">Smart Quizzes</h3>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {user 
              ? "Test your knowledge with interactive quizzes."
              : "Instant feedback that strengthens memory."
            }
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 21l-6-5.25A6 6 0 1118 7.5V7a6 6 0 01-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h3 className="font-semibold">Favorites</h3>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {user 
              ? "Save verbs for quick review and practice."
              : "Pin the verbs you need and drill them fast."
            }
          </p>
        </div>
      </div>

      {/* Conditional CTA - only show if user is NOT logged in */}
      {!user && (
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Sign up to unlock features
          </Link>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center rounded-xl border border-gray-300 dark:border-gray-700 px-5 py-3 font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Log in
          </Link>
        </div>
      )}

      {/* Educational micro-copy */}
      <div className="mt-10 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-5">
        <h4 className="font-semibold">Why verbs first?</h4>
        <ul className="mt-2 list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
          <li>Verbs drive meaning in every sentence.</li>
          <li>Master a few tenses, then add more as you go.</li>
          <li>Practice daily with short sentences for retention.</li>
        </ul>
        {!user && (
          <p className="mt-3 text-xs text-gray-500">
            Progress tracking and favorites require an account.
          </p>
        )}
      </div>
    </section>
  );
}
