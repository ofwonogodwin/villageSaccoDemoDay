'use client';

import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="px-4 py-6">
      {/* Header Section */}
      <div className="mb-10">
        <div className="card bg-gradient-jade p-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-jade-800 mb-2">
              Welcome to Village SACCO
            </h1>
            <p className="text-xl text-jade-700 mb-6">
              Your comprehensive fintech platform powered by <span className="font-semibold">Bitnob API</span>
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/dashboard/cards" className="btn-primary">
                Create Virtual Card
              </Link>
              <Link href="/dashboard/savings" className="btn-secondary">
                Start Saving
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="card hover:shadow-jade">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 bg-jade-100 rounded-xl">
                <svg className="w-6 h-6 text-jade-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-jade-600 uppercase tracking-wide">Virtual Cards</p>
                <p className="text-3xl font-bold text-gray-900">2</p>
                <p className="text-xs text-gray-500">Active cards</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card hover:shadow-jade">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-xl">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-orange-600 uppercase tracking-wide">Total Savings</p>
                <p className="text-3xl font-bold text-gray-900">$1,250</p>
                <p className="text-xs text-gray-500">Across all plans</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card hover:shadow-jade">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Transactions</p>
                <p className="text-3xl font-bold text-gray-900">28</p>
                <p className="text-xs text-gray-500">This month</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card hover:shadow-jade">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-xl">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-purple-600 uppercase tracking-wide">Bitcoin Value</p>
                <p className="text-3xl font-bold text-gray-900">₿0.02</p>
                <p className="text-xs text-gray-500">Portfolio</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/dashboard/cards" className="card hover:shadow-jade transition-all duration-300 group">
            <div className="card-body text-center">
              <div className="mx-auto w-16 h-16 bg-jade-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-jade-200 transition-colors">
                <svg className="w-8 h-8 text-jade-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Virtual Card</h3>
              <p className="text-sm text-gray-600">Generate a new virtual dollar card for online transactions</p>
            </div>
          </Link>

          <Link href="/dashboard/savings" className="card hover:shadow-jade transition-all duration-300 group">
            <div className="card-body text-center">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Bitcoin Savings</h3>
              <p className="text-sm text-gray-600">Start a recurring Bitcoin savings plan</p>
            </div>
          </Link>

          <Link href="/dashboard/transfer" className="card hover:shadow-jade transition-all duration-300 group">
            <div className="card-body text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Send Money</h3>
              <p className="text-sm text-gray-600">Transfer funds to other users or Bitcoin addresses</p>
            </div>
          </Link>

          <Link href="/dashboard/swap" className="card hover:shadow-jade transition-all duration-300 group">
            <div className="card-body text-center">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Currency Swap</h3>
              <p className="text-sm text-gray-600">Exchange between different currencies instantly</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="card">
          <div className="card-body">
            <div className="space-y-4">
              {[
                { type: 'send', amount: '$25.00', description: 'Sent to john@example.com', time: '2 hours ago' },
                { type: 'receive', amount: '$100.00', description: 'Received from savings plan', time: '1 day ago' },
                { type: 'swap', amount: '₿0.001', description: 'Swapped USD to BTC', time: '3 days ago' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activity.type === 'send' ? 'bg-red-100' :
                        activity.type === 'receive' ? 'bg-jade-100' : 'bg-blue-100'
                      }`}>
                      <svg className={`w-5 h-5 ${activity.type === 'send' ? 'text-red-600' :
                          activity.type === 'receive' ? 'text-jade-600' : 'text-blue-600'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {activity.type === 'send' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />}
                        {activity.type === 'receive' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />}
                        {activity.type === 'swap' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />}
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-semibold text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{activity.amount}</p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${activity.type === 'send' ? 'text-red-800 bg-red-100' :
                        activity.type === 'receive' ? 'text-jade-800 bg-jade-100' : 'text-blue-800 bg-blue-100'
                      }`}>
                      {activity.type === 'send' ? 'Sent' : activity.type === 'receive' ? 'Received' : 'Swapped'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Link href="/dashboard/transactions" className="btn-outline">
                View All Transactions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
