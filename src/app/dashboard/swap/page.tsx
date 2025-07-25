'use client';

import { useState, useEffect } from 'react';

export default function SwapPage() {
  const [isSwapping, setIsSwapping] = useState(false);
  const [formData, setFormData] = useState({
    fromCurrency: 'USD',
    toCurrency: 'BTC',
    amount: ''
  });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

  // Mock exchange rates (in a real app, fetch from API)
  const mockRates: Record<string, Record<string, number>> = {
    USD: { BTC: 0.000024, EUR: 0.92, GBP: 0.79, NGN: 1580 },
    BTC: { USD: 42000, EUR: 38640, GBP: 33180, NGN: 66360000 },
    EUR: { USD: 1.09, BTC: 0.000026, GBP: 0.86, NGN: 1720 },
    GBP: { USD: 1.27, BTC: 0.00003, EUR: 1.16, NGN: 2007 },
    NGN: { USD: 0.00063, BTC: 0.000000015, EUR: 0.00058, GBP: 0.0005 }
  };

  useEffect(() => {
    // Simulate fetching exchange rate
    if (formData.fromCurrency && formData.toCurrency && formData.fromCurrency !== formData.toCurrency) {
      setExchangeRate(mockRates[formData.fromCurrency]?.[formData.toCurrency] || 1);
    } else {
      setExchangeRate(null);
    }
  }, [formData.fromCurrency, formData.toCurrency]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSwapping(true);
    setMessage('');

    try {
      const response = await fetch('/api/bitnob/swap-currency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromCurrency: formData.fromCurrency,
          toCurrency: formData.toCurrency,
          amount: parseFloat(formData.amount),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Currency swap completed successfully!');
        setIsSuccess(true);
        setFormData({ ...formData, amount: '' });
      } else {
        setMessage(data.error || 'Failed to swap currency');
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      setIsSuccess(false);
    } finally {
      setIsSwapping(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const swapCurrencies = () => {
    setFormData({
      ...formData,
      fromCurrency: formData.toCurrency,
      toCurrency: formData.fromCurrency
    });
  };

  const getEstimatedAmount = () => {
    if (!formData.amount || !exchangeRate) return '';
    return (parseFloat(formData.amount) * exchangeRate).toFixed(
      formData.toCurrency === 'BTC' ? 8 : 2
    );
  };

  const getCurrencySymbol = (currency: string) => {
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      BTC: '₿',
      NGN: '₦'
    };
    return symbols[currency] || '';
  };

  return (
    <div className="px-6 py-8 space-y-8">
      {/* Header - Improved */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-3">Currency Swap</h1>
          <p className="text-xl text-gray-600">Exchange between different currencies instantly with competitive rates</p>
        </div>
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <p className="text-sm text-gray-500">Exchange Fee</p>
            <p className="text-xl font-bold text-jade-600">0.5%</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Processing</p>
            <p className="text-xl font-bold text-purple-600">Instant</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Swap Form */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Exchange Currencies</h2>

          {message && (
            <div className={`mb-4 p-4 rounded-lg ${isSuccess ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* From Currency */}
            <div>
              <label htmlFor="fromCurrency" className="form-label">
                From
              </label>
              <div className="grid grid-cols-3 gap-2">
                <select
                  id="fromCurrency"
                  name="fromCurrency"
                  value={formData.fromCurrency}
                  onChange={handleInputChange}
                  className="form-input col-span-1"
                  disabled={isSwapping}
                >
                  <option value="USD">USD</option>
                  <option value="BTC">BTC</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="NGN">NGN</option>
                </select>
                <div className="relative col-span-2">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 input-prefix">
                    {getCurrencySymbol(formData.fromCurrency)}
                  </span>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                    min="0.01"
                    step={formData.fromCurrency === 'BTC' ? '0.00000001' : '0.01'}
                    className="form-input pl-8"
                    placeholder="Enter amount"
                    disabled={isSwapping}
                  />
                </div>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={swapCurrencies}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                disabled={isSwapping}
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
            </div>

            {/* To Currency */}
            <div>
              <label htmlFor="toCurrency" className="form-label">
                To
              </label>
              <div className="grid grid-cols-3 gap-2">
                <select
                  id="toCurrency"
                  name="toCurrency"
                  value={formData.toCurrency}
                  onChange={handleInputChange}
                  className="form-input col-span-1"
                  disabled={isSwapping}
                >
                  <option value="USD">USD</option>
                  <option value="BTC">BTC</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="NGN">NGN</option>
                </select>
                <div className="relative col-span-2">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 input-prefix">
                    {getCurrencySymbol(formData.toCurrency)}
                  </span>
                  <input
                    type="text"
                    value={getEstimatedAmount()}
                    className="form-input pl-8 bg-gray-50"
                    placeholder="Estimated amount"
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Exchange Rate */}
            {exchangeRate && (
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-purple-800 mb-2">Exchange Rate</h3>
                <p className="text-lg font-semibold text-purple-700">
                  1 {formData.fromCurrency} = {exchangeRate.toFixed(formData.toCurrency === 'BTC' ? 8 : 4)} {formData.toCurrency}
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  Rate updated: {new Date().toLocaleTimeString()}
                </p>
              </div>
            )}

            {/* Transaction Summary */}
            {formData.amount && exchangeRate && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-800 mb-3">Transaction Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">You send:</span>
                    <span className="font-medium text-blue-700">
                      {getCurrencySymbol(formData.fromCurrency)}{formData.amount} {formData.fromCurrency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Exchange fee:</span>
                    <span className="font-medium text-blue-700">0.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">You receive:</span>
                    <span className="font-medium text-blue-700">
                      {getCurrencySymbol(formData.toCurrency)}{getEstimatedAmount()} {formData.toCurrency}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSwapping || !formData.amount || formData.fromCurrency === formData.toCurrency}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSwapping ? 'Swapping...' : 'Swap Currency'}
            </button>
          </form>
        </div>

        {/* Market Rates */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Market Rates</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-700 border-b pb-2">
              <span>Pair</span>
              <span>Rate</span>
              <span>24h Change</span>
            </div>

            {[
              { pair: 'BTC/USD', rate: '42,000.00', change: '+2.5%', positive: true },
              { pair: 'USD/EUR', rate: '0.9200', change: '-0.1%', positive: false },
              { pair: 'USD/GBP', rate: '0.7900', change: '+0.3%', positive: true },
              { pair: 'USD/NGN', rate: '1,580.00', change: '+0.8%', positive: true },
              { pair: 'BTC/EUR', rate: '38,640.00', change: '+2.4%', positive: true },
            ].map((rate, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 py-2 text-sm">
                <span className="font-medium text-gray-900">{rate.pair}</span>
                <span className="text-gray-700">{rate.rate}</span>
                <span className={`font-medium ${rate.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {rate.change}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Rate Updates</h3>
            <p className="text-xs text-gray-600">
              Rates are updated every 30 seconds during market hours.
              Actual exchange rates may vary based on market conditions.
            </p>
          </div>
        </div>
      </div>

      {/* Swap Features */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 text-center">
          <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Exchange</h3>
          <p className="text-gray-600 text-sm">Get the best rates with instant currency conversion</p>
        </div>

        <div className="card p-6 text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Competitive Rates</h3>
          <p className="text-gray-600 text-sm">Low fees starting from 0.5% with transparent pricing</p>
        </div>

        <div className="card p-6 text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Trading</h3>
          <p className="text-gray-600 text-sm">Bank-level security with encrypted transactions</p>
        </div>
      </div>
    </div>
  );
}
