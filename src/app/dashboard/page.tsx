'use client';

import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="px-6 py-8 space-y-8">
      {/* Header Section - Reduced height, cleaner design */}
      <div className="section-spacing">
        <div className="card bg-gradient-jade p-10 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-white mb-4">
              Welcome to Village SACCO
            </h1>
            <p className="text-xl text-jade-100 mb-8 max-w-2xl mx-auto">
              Your comprehensive fintech platform powered by <span className="font-semibold text-white">Bitnob API</span>
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/dashboard/cards" className="btn-primary">
                <span className="mr-2">💳</span>
                Create Virtual Card
              </Link>
              <Link href="/dashboard/savings" className="btn-secondary">
                <span className="mr-2">💰</span>
                Start Saving
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats - Better organized */}
      <div className="section-spacing">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Account Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="card feature-card stat-card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="icon-wrapper bg-jade-100">
                  <svg className="w-8 h-8 text-jade-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-jade-600 uppercase tracking-wide">Virtual Cards</p>
                  <p className="text-3xl font-bold text-gray-900">2</p>
                  <p className="text-sm text-muted">Active cards</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card feature-card stat-card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="icon-wrapper bg-orange-100">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-orange-600 uppercase tracking-wide">Total Savings</p>
                  <p className="text-3xl font-bold text-gray-900">$1,250</p>
                  <p className="text-sm text-gray-500">Across all plans</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card feature-card stat-card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="icon-wrapper bg-blue-100">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Transactions</p>
                  <p className="text-3xl font-bold text-gray-900">28</p>
                  <p className="text-sm text-gray-500">This month</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card feature-card stat-card">
            <div className="card-body">
              <div className="flex items-center">
                <div className="icon-wrapper bg-purple-100">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-purple-600 uppercase tracking-wide">Bitcoin Value</p>
                  <p className="text-3xl font-bold text-gray-900">₿0.02</p>
                  <p className="text-sm text-gray-500">Portfolio</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Improved spacing and layout */}
      <div className="section-spacing">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <Link href="/dashboard/cards" className="card feature-card group text-decoration-none">
            <div className="card-body text-center">
              <div className="icon-wrapper bg-jade-100 mx-auto group-hover:bg-jade-200 transition-colors">
                <svg className="w-8 h-8 text-jade-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Virtual Cards</h3>
              <p className="text-gray-600 leading-relaxed">Create and manage your virtual cards for secure online transactions</p>
            </div>
          </Link>

          <Link href="/dashboard/savings" className="card feature-card group text-decoration-none">
            <div className="card-body text-center">
              <div className="icon-wrapper bg-orange-100 mx-auto group-hover:bg-orange-200 transition-colors">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Bitcoin Savings</h3>
              <p className="text-gray-600 leading-relaxed">Start a recurring Bitcoin savings plan and grow your portfolio</p>
            </div>
          </Link>

          <Link href="/dashboard/transfer" className="card feature-card group text-decoration-none">
            <div className="card-body text-center">
              <div className="icon-wrapper bg-blue-100 mx-auto group-hover:bg-blue-200 transition-colors">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Send Money</h3>
              <p className="text-gray-600 leading-relaxed">Transfer funds to other users or Bitcoin addresses instantly</p>
            </div>
          </Link>

          <Link href="/dashboard/swap" className="card feature-card group text-decoration-none">
            <div className="card-body text-center">
              <div className="icon-wrapper bg-purple-100 mx-auto group-hover:bg-purple-200 transition-colors">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Currency Swap</h3>
              <p className="text-gray-600 leading-relaxed">Exchange between different currencies instantly and securely</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity - More organized */}
      <div className="section-spacing">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="card">
          <div className="card-body">
            <div className="space-y-6">
              {[
                { type: 'send', amount: '$25.00', description: 'Sent to john@example.com', time: '2 hours ago' },
                { type: 'receive', amount: '$100.00', description: 'Received from savings plan', time: '1 day ago' },
                { type: 'swap', amount: '₿0.001', description: 'Swapped USD to BTC', time: '3 days ago' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-4 px-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${activity.type === 'send' ? 'bg-red-100' :
                      activity.type === 'receive' ? 'bg-jade-100' : 'bg-blue-100'
                      }`}>
                      <svg className={`w-6 h-6 ${activity.type === 'send' ? 'text-red-600' :
                        activity.type === 'receive' ? 'text-jade-600' : 'text-blue-600'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {activity.type === 'send' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />}
                        {activity.type === 'receive' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />}
                        {activity.type === 'swap' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />}
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-base font-semibold text-gray-900">{activity.description}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{activity.amount}</p>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${activity.type === 'send' ? 'text-red-800 bg-red-100' :
                      activity.type === 'receive' ? 'text-jade-800 bg-jade-100' : 'text-blue-800 bg-blue-100'
                      }`}>
                      {activity.type === 'send' ? 'Sent' : activity.type === 'receive' ? 'Received' : 'Swapped'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link href="/dashboard/transactions" className="btn-outline">
                <span className="mr-2">📋</span>
                View All Transactions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
