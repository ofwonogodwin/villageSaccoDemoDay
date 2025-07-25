'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function AccessDeniedPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Access Denied
          </h2>

          {!session ? (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-4">
                You need to be logged in to access this page.
              </p>
              <Link
                href="/login"
                className="btn-primary inline-block"
              >
                Sign In
              </Link>
            </div>
          ) : !session.user.isApproved ? (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-4">
                Your account is not yet approved by the admin. Please wait for approval or contact support.
              </p>
              <div className="space-y-2">
                <p className="text-xs text-gray-500">
                  Account: {session.user.email}
                </p>
                <p className="text-xs text-gray-500">
                  Status: Pending Approval
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-4">
                You don't have permission to access this page.
              </p>
              <Link
                href="/dashboard"
                className="btn-primary inline-block"
              >
                Go to Dashboard
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
