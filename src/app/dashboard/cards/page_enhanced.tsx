'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function VirtualCardsPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    userName: '',
    amount: '',
    currency: 'USD'
  });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setMessage('');

    try {
      const response = await fetch('/api/bitnob/create-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: formData.userName,
          amount: parseFloat(formData.amount),
          currency: formData.currency,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Virtual card created successfully!');
        setIsSuccess(true);
        setFormData({ userName: '', amount: '', currency: 'USD' });
      } else {
        setMessage(data.error || 'Failed to create virtual card');
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      setIsSuccess(false);
    } finally {
      setIsCreating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="px-4 py-6">
      {/* Page Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Virtual Cards</h1>
            <p className="text-xl text-gray-600">
              Create and manage your virtual dollar cards for secure online transactions
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-jade-100 rounded-xl flex items-center justify-center">
              <span className="text-3xl">💳</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="card hover:shadow-jade">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 bg-jade-100 rounded-xl">
                <span className="text-xl">💳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-jade-600 uppercase tracking-wide">Active Cards</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card hover:shadow-jade">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl">
                <span className="text-xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Total Balance</p>
                <p className="text-2xl font-bold text-gray-900">$850.00</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card hover:shadow-jade">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-xl">
                <span className="text-xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-orange-600 uppercase tracking-wide">This Month</p>
                <p className="text-2xl font-bold text-gray-900">$145.50</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Card Form */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-jade-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-lg">✨</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Create New Virtual Card</h2>
            </div>

            {message && (
              <div className={`mb-6 p-4 rounded-lg ${isSuccess
                  ? 'bg-jade-50 text-jade-800 border border-jade-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                <div className="flex items-center">
                  <span className="mr-2">
                    {isSuccess ? '✅' : '❌'}
                  </span>
                  {message}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="userName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  id="userName"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="Enter cardholder name"
                  disabled={isCreating}
                />
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">
                  Initial Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  min="10"
                  step="0.01"
                  className="form-input"
                  placeholder="Enter amount (minimum $10)"
                  disabled={isCreating}
                />
              </div>

              <div>
                <label htmlFor="currency" className="block text-sm font-semibold text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="form-input"
                  disabled={isCreating}
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isCreating}
                className={`w-full btn-primary ${isCreating ? 'loading' : ''}`}
              >
                {isCreating ? (
                  <div className="flex items-center justify-center">
                    <div className="loading-spinner mr-2"></div>
                    Creating Card...
                  </div>
                ) : (
                  'Create Virtual Card'
                )}
              </button>
            </form>

            <div className="mt-6 p-4 bg-jade-50 rounded-lg">
              <div className="flex items-start">
                <span className="text-jade-600 mr-2">💡</span>
                <div>
                  <p className="text-sm font-semibold text-jade-800">Pro Tip:</p>
                  <p className="text-xs text-jade-700 mt-1">
                    Virtual cards are perfect for online shopping and subscription services.
                    You can freeze or unfreeze them anytime for added security.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Existing Cards */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Virtual Cards</h2>
              <Link href="/dashboard/cards/manage" className="btn-outline text-sm">
                Manage All
              </Link>
            </div>

            <div className="space-y-4">
              {/* Sample cards - replace with real data */}
              <div className="bg-gradient-jade p-6 rounded-xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-sm opacity-90">Virtual Card</p>
                      <p className="text-xs opacity-75">VISA</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm opacity-90">Balance</p>
                      <p className="text-lg font-bold">$450.00</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-lg font-mono tracking-wider">•••• •••• •••• 8549</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs opacity-75">CARDHOLDER</p>
                      <p className="text-sm font-semibold">JOHN DOE</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs opacity-75">EXPIRES</p>
                      <p className="text-sm font-semibold">12/27</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-sm opacity-90">Virtual Card</p>
                      <p className="text-xs opacity-75">MASTERCARD</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm opacity-90">Balance</p>
                      <p className="text-lg font-bold">$400.00</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-lg font-mono tracking-wider">•••• •••• •••• 7234</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs opacity-75">CARDHOLDER</p>
                      <p className="text-sm font-semibold">JOHN DOE</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs opacity-75">EXPIRES</p>
                      <p className="text-sm font-semibold">11/26</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl text-gray-400">💳</span>
                </div>
                <p className="text-gray-600 mb-4">Ready to create your first virtual card?</p>
                <p className="text-sm text-gray-500">Fill out the form to get started with secure online payments.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Management Actions */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/cards/topup" className="card hover:shadow-jade transition-all duration-300 group">
          <div className="card-body text-center">
            <div className="w-12 h-12 bg-jade-100 rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:bg-jade-200 transition-colors">
              <span className="text-xl">💰</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Top Up Card</h3>
            <p className="text-sm text-gray-600">Add funds to your virtual cards instantly</p>
          </div>
        </Link>

        <Link href="/dashboard/cards/transactions" className="card hover:shadow-jade transition-all duration-300 group">
          <div className="card-body text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <span className="text-xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">View Transactions</h3>
            <p className="text-sm text-gray-600">Check your card transaction history</p>
          </div>
        </Link>

        <Link href="/dashboard/cards/settings" className="card hover:shadow-jade transition-all duration-300 group">
          <div className="card-body text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <span className="text-xl">⚙️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Card Settings</h3>
            <p className="text-sm text-gray-600">Manage limits, freeze/unfreeze cards</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
