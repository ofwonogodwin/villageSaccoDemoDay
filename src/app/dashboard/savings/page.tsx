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
    <div className="px-6 py-8 space-y-8">
      {/* Header - Cleaner design */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-3">Bitcoin Savings</h1>
          <p className="text-xl text-gray-600">Build your Bitcoin portfolio with automated recurring purchases</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Saved</p>
            <p className="text-2xl font-bold text-jade-600">$250.00</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Bitcoin Value</p>
            <p className="text-2xl font-bold text-orange-600">₿0.0025</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
        {/* Create Savings Plan Form */}
        <div className="card feature-card">
          <div className="card-body">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Create Savings Plan</h2>

            {message && (
              <div className={`mb-6 p-4 rounded-xl border flex items-center space-x-3 ${isSuccess
                ? 'bg-jade-50 text-jade-800 border-jade-200'
                : 'bg-red-50 text-red-800 border-red-200'
                }`}>
                <span className="text-xl">
                  {isSuccess ? '✅' : '❌'}
                </span>
                <span className="font-medium">{message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label htmlFor="amount" className="form-label">
                  Amount per {formData.frequency.replace('ly', '')}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 input-prefix">$</span>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="frequency" className="form-label">
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
                  <label htmlFor="currency" className="form-label">
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
              </div>

              <div>
                <label htmlFor="startDate" className="form-label">
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
                <div className="bg-gradient-to-r from-jade-50 to-blue-50 rounded-xl p-6 border border-jade-100">
                  <h3 className="text-lg font-semibold text-jade-800 mb-4 flex items-center">
                    <span className="mr-2">📈</span>
                    Savings Projections
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Monthly</p>
                      <p className="text-2xl font-bold text-jade-700">${projections.monthly.toFixed(2)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Yearly</p>
                      <p className="text-2xl font-bold text-jade-700">${projections.yearly.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isCreating}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed h-14 text-lg"
              >
                {isCreating ? (
                  <div className="flex items-center justify-center">
                    <div className="loading-spinner mr-3"></div>
                    Creating Plan...
                  </div>
                ) : (
                  <>
                    <span className="mr-2">🚀</span>
                    Create Savings Plan
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Existing Plans */}
        <div className="card feature-card">
          <div className="card-body">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Savings Plans</h2>

            <div className="space-y-6">
              {/* Sample plan - replace with real data */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Weekly Bitcoin Plan</h3>
                    <p className="text-sm text-gray-600">Started: Jan 15, 2025</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                    ✅ Active
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Amount</p>
                    <p className="text-xl font-bold text-gray-900">$50.00 / week</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Saved</p>
                    <p className="text-xl font-bold text-jade-600">$250.00</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>25%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-3 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-orange-200">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">₿0.0025 BTC</span>
                    <span className="text-sm text-gray-600">Next: Jan 29</span>
                  </div>
                  <button className="btn-outline btn-sm">
                    Manage Plan
                  </button>
                </div>
              </div>

              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl text-gray-400">💰</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Your Bitcoin Journey</h3>
                <p className="text-gray-600 max-w-sm mx-auto">Create your first savings plan and begin building your Bitcoin portfolio with automated purchases.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="section-spacing">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Bitcoin Savings?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card feature-card text-center">
            <div className="card-body">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Dollar Cost Averaging</h3>
              <p className="text-gray-600">Reduce risk by spreading purchases over time, smoothing out price volatility</p>
            </div>
          </div>

          <div className="card feature-card text-center">
            <div className="card-body">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Automated Savings</h3>
              <p className="text-gray-600">Set it and forget it - automatic Bitcoin purchases without the stress</p>
            </div>
          </div>

          <div className="card feature-card text-center">
            <div className="card-body">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Long-term Growth</h3>
              <p className="text-gray-600">Build wealth over time with consistent investing in digital assets</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
