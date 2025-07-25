'use client';

import Link from "next/link";
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-jade-50 to-jade-100">
      {/* Navigation Header */}
      <header className="absolute inset-x-0 top-0 z-50 page-header">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="text-3xl font-bold bg-gradient-jade-primary bg-clip-text text-transparent">
                Village SACCO
              </span>
            </Link>
          </div>
          <div className="flex lg:flex-1 lg:justify-end space-x-4">
            {session ? (
              <Link
                href="/dashboard"
                className="btn-primary"
              >
                Dashboard <span aria-hidden="true">→</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="btn-outline"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="btn-primary"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-transparent sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-20 mx-auto max-w-7xl px-4 sm:mt-24 sm:px-6 md:mt-28 lg:mt-32 lg:px-8 xl:mt-40">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-5xl tracking-tight font-extrabold text-gray-900 sm:text-6xl md:text-7xl">
                  <span className="block xl:inline">Village</span>{' '}
                  <span className="block bg-gradient-jade-primary bg-clip-text text-transparent xl:inline">SACCO</span>
                </h1>
                <p className="mt-6 text-xl text-gray-600 sm:mt-8 sm:text-2xl sm:max-w-xl sm:mx-auto md:mt-8 md:text-xl lg:mx-0 leading-relaxed">
                  Your comprehensive fintech platform powered by <span className="text-jade-600 font-semibold">Bitnob API</span>.
                  Create virtual cards, save in Bitcoin, transfer money, and swap currencies - all in one secure place.
                </p>
                <div className="mt-8 sm:mt-12 sm:flex sm:justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="rounded-md">
                    {session ? (
                      <Link
                        href="/dashboard"
                        className="btn-primary text-lg px-10 py-4"
                      >
                        Go to Dashboard
                      </Link>
                    ) : (
                      <Link
                        href="/register"
                        className="btn-primary text-lg px-10 py-4"
                      >
                        Get Started Free
                      </Link>
                    )}
                  </div>
                  <div>
                    <a
                      href="#features"
                      className="btn-secondary text-lg px-10 py-4"
                    >
                      Learn More
                    </a>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>

        {/* Hero Visual Element */}
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full bg-gradient-jade sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 bg-jade-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-jade-lg">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <p className="text-jade-700 font-semibold text-lg">Secure Financial Platform</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need for modern finance
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Powered by Bitnob&apos;s secure sandbox APIs, offering a complete fintech experience.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Virtual Dollar Cards</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Create virtual cards instantly for secure online transactions with international merchants.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Bitcoin Savings</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Build your Bitcoin portfolio with automated recurring purchases and dollar-cost averaging.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Instant Transfers</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Send money instantly to email addresses or Bitcoin wallets with low fees.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Currency Swap</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Exchange between USD, Bitcoin, EUR, GBP, and NGN with competitive rates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block">Access your dashboard today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-primary-100">
            Join the future of finance with our comprehensive SACCO platform.
          </p>
          <Link
            href="/dashboard"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-primary-50 sm:w-auto"
          >
            Open Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
