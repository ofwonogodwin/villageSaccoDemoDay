'use client';

import { useState } from 'react';

interface TransferResult {
  transactionReference: string;
  amount: string;
  currency: string;
  recipient: string;
  status: string;
  requiresOtp: boolean;
  estimatedFee: string;
  createdAt: string;
}

export default function TransferPage() {
  const [isTransferring, setIsTransferring] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    currency: 'USD',
    reason: ''
  });
  const [otpData, setOtpData] = useState({
    otp: '',
    transactionReference: ''
  });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [receiverType, setReceiverType] = useState<'email' | 'bitcoin' | 'phone'>('email');
  const [transferResult, setTransferResult] = useState<TransferResult | null>(null);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [recipientValidation, setRecipientValidation] = useState<any>(null);

  const validateRecipient = async (recipient: string, currency: string) => {
    if (!recipient || !currency) return;

    setIsValidating(true);
    try {
      const response = await fetch('/api/bitnob/transfers/validate-recipient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipient, currency }),
      });

      const data = await response.json();

      if (data.success) {
        setRecipientValidation(data.data);
        setMessage('Recipient validated successfully');
        setIsSuccess(true);
      } else {
        setRecipientValidation(null);
        setMessage(data.message || 'Failed to validate recipient');
        setIsSuccess(false);
      }
    } catch (error) {
      setRecipientValidation(null);
      setMessage('Failed to validate recipient');
      setIsSuccess(false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTransferring(true);
    setMessage('');
    setTransferResult(null);

    try {
      const response = await fetch('/api/bitnob/transfers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient: formData.recipient,
          amount: formData.amount,
          currency: formData.currency,
          reason: formData.reason || undefined,
        }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        setTransferResult(data.data);
        setMessage('Transfer initiated successfully!');
        setIsSuccess(true);

        if (data.data.requiresOtp) {
          setOtpData({
            otp: '',
            transactionReference: data.data.transactionReference
          });
          setShowOtpForm(true);
          setMessage('Transfer initiated! Please enter the OTP sent to your registered device.');
        } else {
          setMessage('Transfer completed successfully!');
          setFormData({ recipient: '', amount: '', currency: 'USD', reason: '' });
        }
      } else {
        setMessage(data.message || 'Failed to initiate transfer');
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      setIsSuccess(false);
    } finally {
      setIsTransferring(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFinalizing(true);
    setMessage('');

    try {
      const response = await fetch('/api/bitnob/transfers/finalize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionReference: otpData.transactionReference,
          otp: otpData.otp,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Transfer completed successfully!');
        setIsSuccess(true);
        setShowOtpForm(false);
        setFormData({ recipient: '', amount: '', currency: 'USD', reason: '' });
        setOtpData({ otp: '', transactionReference: '' });
        setTransferResult(null);
      } else {
        setMessage(data.message || 'Failed to complete transfer');
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      setIsSuccess(false);
    } finally {
      setIsFinalizing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    // Trigger recipient validation when recipient or currency changes
    if (name === 'recipient' || name === 'currency') {
      const recipient = name === 'recipient' ? value : formData.recipient;
      const currency = name === 'currency' ? value : formData.currency;

      if (recipient && currency) {
        // Debounce validation
        const timeoutId = setTimeout(() => {
          validateRecipient(recipient, currency);
        }, 500);
        return () => clearTimeout(timeoutId);
      }
    }
  };

  const detectReceiverType = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const btcRegex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/;
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;

    if (emailRegex.test(value)) {
      setReceiverType('email');
    } else if (btcRegex.test(value)) {
      setReceiverType('bitcoin');
    } else if (phoneRegex.test(value)) {
      setReceiverType('phone');
    }
  };

  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      recipient: value
    });
    detectReceiverType(value);
    setRecipientValidation(null); // Reset validation when recipient changes
  };

  return (
    <div className="px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Send Money</h1>
        <p className="mt-2 text-gray-600">
          Transfer funds to other users or Bitcoin addresses instantly
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Send Money Form */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Transfer Funds</h2>

          {message && (
            <div className={`mb-4 p-4 rounded-lg ${isSuccess ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="recipient" className="form-label">
                Recipient (Email, Phone or Bitcoin Address)
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="recipient"
                  name="recipient"
                  value={formData.recipient}
                  onChange={handleRecipientChange}
                  required
                  className={`form-input pr-10 ${recipientValidation
                    ? 'border-green-500 focus:border-green-500'
                    : isValidating
                      ? 'border-yellow-500 focus:border-yellow-500'
                      : ''
                    }`}
                  placeholder="Enter email, phone or Bitcoin address"
                  disabled={isTransferring}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {isValidating && (
                    <svg className="w-5 h-5 text-yellow-500 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {!isValidating && recipientValidation && (
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {!isValidating && !recipientValidation && receiverType === 'email' && (
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  )}
                  {!isValidating && !recipientValidation && receiverType === 'bitcoin' && (
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  )}
                  {!isValidating && !recipientValidation && receiverType === 'phone' && (
                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  )}
                </div>
              </div>
              {formData.recipient && (
                <p className="helper-text">
                  Detected: {receiverType === 'email' ? 'Email Address' : receiverType === 'bitcoin' ? 'Bitcoin Address' : 'Phone Number'}
                  {recipientValidation && <span className="text-green-600 ml-2 font-medium">✓ Validated</span>}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="amount" className="form-label">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 input-prefix">
                  {formData.currency === 'BTC' ? '₿' : '$'}
                </span>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  min="0.01"
                  step={formData.currency === 'BTC' ? '0.00000001' : '0.01'}
                  className="form-input pl-8"
                  placeholder="Enter amount"
                  disabled={isTransferring}
                />
              </div>
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
                disabled={isTransferring}
              >
                <option value="USD">USD - US Dollar</option>
                <option value="BTC">BTC - Bitcoin</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="NGN">NGN - Nigerian Naira</option>
              </select>
            </div>

            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                Reason (Optional)
              </label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                rows={3}
                className="form-input resize-none"
                placeholder="Enter reason for transfer"
                disabled={isTransferring}
              />
            </div>

            {/* Transaction Preview */}
            {formData.amount && formData.recipient && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-800 mb-3">Transaction Preview</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">To:</span>
                    <span className="font-medium text-blue-700">
                      {formData.recipient.length > 20
                        ? `${formData.recipient.slice(0, 20)}...`
                        : formData.recipient}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium text-blue-700">
                      {formData.currency === 'BTC' ? '₿' : '$'}{formData.amount} {formData.currency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fee:</span>
                    <span className="font-medium text-blue-700">$0.50</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-700">Total:</span>
                    <span className="text-blue-700">
                      {formData.currency === 'BTC' ? '₿' : '$'}{(parseFloat(formData.amount) + 0.50).toFixed(2)} {formData.currency}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isTransferring}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTransferring ? 'Sending...' : 'Send Money'}
            </button>
          </form>
        </div>

        {/* OTP Verification Form */}
        {showOtpForm && transferResult && (
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Verify Transfer</h2>

            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Transfer Details</h3>
              <div className="space-y-1 text-sm text-blue-700">
                <p><span className="font-medium">Reference:</span> {transferResult.transactionReference}</p>
                <p><span className="font-medium">Amount:</span> {transferResult.currency === 'BTC' ? '₿' : '$'}{transferResult.amount} {transferResult.currency}</p>
                <p><span className="font-medium">To:</span> {transferResult.recipient}</p>
                <p><span className="font-medium">Status:</span> {transferResult.status}</p>
              </div>
            </div>

            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP Code
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otpData.otp}
                  onChange={(e) => setOtpData({ ...otpData, otp: e.target.value })}
                  required
                  maxLength={6}
                  className="form-input text-center text-lg font-mono"
                  placeholder="123456"
                  disabled={isFinalizing}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter the 6-digit code sent to your registered device
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={isFinalizing || otpData.otp.length !== 6}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isFinalizing ? 'Verifying...' : 'Complete Transfer'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowOtpForm(false);
                    setOtpData({ otp: '', transactionReference: '' });
                    setTransferResult(null);
                  }}
                  className="flex-1 btn-secondary"
                  disabled={isFinalizing}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Recent Transfers */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Transfers</h2>

          <div className="space-y-4">
            {[
              {
                to: 'john@example.com',
                amount: '$25.00',
                status: 'completed',
                time: '2 hours ago',
                description: 'Lunch payment'
              },
              {
                to: 'bc1qxy2k...',
                amount: '₿0.001',
                status: 'pending',
                time: '1 day ago',
                description: 'Bitcoin transfer'
              },
              {
                to: 'mary@example.com',
                amount: '$100.00',
                status: 'completed',
                time: '3 days ago',
                description: 'Rent contribution'
              },
            ].map((transfer, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-900">
                      {transfer.to.includes('@') ? transfer.to : `${transfer.to.slice(0, 12)}...`}
                    </p>
                    <p className="text-sm text-gray-600">{transfer.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{transfer.amount}</p>
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${transfer.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {transfer.status}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">{transfer.time}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button className="text-primary hover:text-primary-600 text-sm font-medium">
              View All Transfers
            </button>
          </div>
        </div>
      </div>

      {/* Transfer Features */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Transfers</h3>
          <p className="text-gray-600 text-sm">Send money instantly to anyone with an email address</p>
        </div>

        <div className="card p-6 text-center">
          <div className="mx-auto w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Bitcoin Support</h3>
          <p className="text-gray-600 text-sm">Send Bitcoin directly to any valid Bitcoin address</p>
        </div>

        <div className="card p-6 text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Low Fees</h3>
          <p className="text-gray-600 text-sm">Competitive transfer fees starting from just $0.50</p>
        </div>
      </div>
    </div>
  );
}
