'use client';

import { useState } from 'react';

export default function SavingsPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    frequency: 'weekly',
    currency: 'USD',
    startDate: ''
  });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Set minimum start date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setMessage('');

    try {
      const response = await fetch('/api/bitnob/savings-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(formData.amount),
          frequency: formData.frequency,
          currency: formData.currency,
          startDate: formData.startDate,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Bitcoin savings plan created successfully!');
        setIsSuccess(true);
        setFormData({ amount: '', frequency: 'weekly', currency: 'USD', startDate: '' });
      } else {
        setMessage(data.error || 'Failed to create savings plan');
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

  const calculateProjections = () => {
    const amount = parseFloat(formData.amount) || 0;
    const multiplier = formData.frequency === 'daily' ? 365 : formData.frequency === 'weekly' ? 52 : 12;
    return {
      monthly: amount * (multiplier / 12),
      yearly: amount * multiplier
    };
  };

  const projections = calculateProjections();

  return (
    <div className="px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Bitcoin Savings</h1>
        <p className="mt-2 text-gray-600">
          Build your Bitcoin portfolio with automated recurring purchases
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Savings Plan Form */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Create Savings Plan</h2>

          {message && (
            <div className={`mb-4 p-4 rounded-lg ${isSuccess ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Amount per {formData.frequency.replace('ly', '')}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  min="1"
                  step="0.01"
                  className="form-input pl-8"
                  placeholder="Enter amount"
                  disabled={isCreating}
                />
              </div>
            </div>

            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-2">
                Frequency
              </label>
              <select
                id="frequency"
                name="frequency"
                value={formData.frequency}
                onChange={handleInputChange}
                className="form-input"
                disabled={isCreating}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
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
                <option value="NGN">NGN - Nigerian Naira</option>
              </select>
            </div>

            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                min={minDate}
                className="form-input"
                disabled={isCreating}
              />
            </div>

            {/* Projections */}
            {formData.amount && (
              <div className="bg-primary-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-primary-800 mb-3">Savings Projections</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Monthly</p>
                    <p className="font-semibold text-primary-700">${projections.monthly.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Yearly</p>
                    <p className="font-semibold text-primary-700">${projections.yearly.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isCreating}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Creating Plan...' : 'Create Savings Plan'}
            </button>
          </form>
        </div>

        {/* Existing Plans */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Savings Plans</h2>

          <div className="space-y-4">
            {/* Sample plan - replace with real data */}
            <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">Weekly Bitcoin Plan</h3>
                  <p className="text-sm text-gray-600">Started: Jan 15, 2025</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                  Active
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="font-semibold">$50.00 / week</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Saved</p>
                  <p className="font-semibold">$250.00</p>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div className="bg-orange-600 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>₿0.0025 BTC</span>
                <span>Next: Jan 29</span>
              </div>
            </div>

            <div className="text-center py-8 text-gray-500">
              <svg className="mx-auto w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <p className="text-sm">Start your Bitcoin savings journey today</p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 text-center">
          <div className="mx-auto w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Dollar Cost Averaging</h3>
          <p className="text-gray-600 text-sm">Reduce risk by spreading purchases over time</p>
        </div>

        <div className="card p-6 text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Automated Savings</h3>
          <p className="text-gray-600 text-sm">Set it and forget it - automatic Bitcoin purchases</p>
        </div>

        <div className="card p-6 text-center">
          <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Long-term Growth</h3>
          <p className="text-gray-600 text-sm">Build wealth over time with consistent investing</p>
        </div>
      </div>
    </div>
  );
}
