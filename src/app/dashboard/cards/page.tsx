'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Card {
  id: string
  cardBrand?: string
  maskedCardNumber?: string
  status?: string
  balance?: number
  currency?: string
  expiryDate?: string
  cardType?: string
  createdAt?: string
}

interface LoadingStates {
  creating: boolean
  loading: boolean
  topup: boolean
  managing: { [key: string]: boolean }
}

export default function VirtualCards() {
  const { data: session } = useSession()
  const [cards, setCards] = useState<Card[]>([])
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    creating: false,
    loading: true,
    topup: false,
    managing: {}
  })
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  // Form states
  const [createFormData, setCreateFormData] = useState({
    userName: '',
    amount: '',
    currency: 'USD',
    cardBrand: 'visa'
  })

  const [topupFormData, setTopupFormData] = useState({
    cardId: '',
    amount: '',
    currency: 'USD'
  })

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showTopupForm, setShowTopupForm] = useState(false)

  // Fetch cards on component mount
  useEffect(() => {
    fetchCards()
  }, [])

  const fetchCards = async () => {
    try {
      setLoadingStates(prev => ({ ...prev, loading: true }))
      const response = await fetch('/api/bitnob/get-cards')

      if (response.ok) {
        const result = await response.json()
        setCards(result.data?.cards || [])
      } else {
        const error = await response.json()
        setMessage(error.error || 'Failed to fetch cards')
        setMessageType('error')
      }
    } catch (error) {
      setMessage('Error fetching cards: ' + error)
      setMessageType('error')
    } finally {
      setLoadingStates(prev => ({ ...prev, loading: false }))
    }
  }

  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!createFormData.userName || !createFormData.amount) {
      setMessage('Please fill in all required fields')
      setMessageType('error')
      return
    }

    try {
      setLoadingStates(prev => ({ ...prev, creating: true }))

      const response = await fetch('/api/bitnob/create-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createFormData),
      })

      const result = await response.json()

      if (response.ok) {
        setMessage('Virtual card created successfully!')
        setMessageType('success')
        setCreateFormData({ userName: '', amount: '', currency: 'USD', cardBrand: 'visa' })
        setShowCreateForm(false)
        fetchCards() // Refresh cards list
      } else {
        setMessage(result.error || 'Failed to create card')
        setMessageType('error')
      }
    } catch (error) {
      setMessage('Error creating card: ' + error)
      setMessageType('error')
    } finally {
      setLoadingStates(prev => ({ ...prev, creating: false }))
    }
  }

  const handleTopupCard = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!topupFormData.cardId || !topupFormData.amount) {
      setMessage('Please select a card and enter amount')
      setMessageType('error')
      return
    }

    try {
      setLoadingStates(prev => ({ ...prev, topup: true }))

      const response = await fetch('/api/bitnob/topup-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(topupFormData),
      })

      const result = await response.json()

      if (response.ok) {
        setMessage('Card topped up successfully!')
        setMessageType('success')
        setTopupFormData({ cardId: '', amount: '', currency: 'USD' })
        setShowTopupForm(false)
        fetchCards() // Refresh cards list
      } else {
        setMessage(result.error || 'Failed to top up card')
        setMessageType('error')
      }
    } catch (error) {
      setMessage('Error topping up card: ' + error)
      setMessageType('error')
    } finally {
      setLoadingStates(prev => ({ ...prev, topup: false }))
    }
  }

  const handleManageCard = async (cardId: string, action: 'freeze' | 'unfreeze') => {
    try {
      setLoadingStates(prev => ({
        ...prev,
        managing: { ...prev.managing, [cardId]: true }
      }))

      const response = await fetch('/api/bitnob/manage-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardId, action }),
      })

      const result = await response.json()

      if (response.ok) {
        setMessage(`Card ${action}d successfully!`)
        setMessageType('success')
        fetchCards() // Refresh cards list
      } else {
        setMessage(result.error || `Failed to ${action} card`)
        setMessageType('error')
      }
    } catch (error) {
      setMessage(`Error ${action}ing card: ` + error)
      setMessageType('error')
    } finally {
      setLoadingStates(prev => ({
        ...prev,
        managing: { ...prev.managing, [cardId]: false }
      }))
    }
  }

  const formatCardNumber = (cardNumber: string | undefined | null) => {
    if (!cardNumber) {
      return '**** **** **** ****'
    }
    return cardNumber.replace(/(.{4})/g, '$1 ').trim()
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-jade-50 via-white to-jade-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-jade-800 mb-2">Virtual Cards</h1>
            <p className="text-jade-600">Manage your virtual debit cards</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-3 bg-jade-600 text-white font-medium rounded-xl hover:bg-jade-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Create New Card
            </button>

            <button
              onClick={() => setShowTopupForm(true)}
              className="px-6 py-3 bg-jade-500 text-white font-medium rounded-xl hover:bg-jade-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Top Up Card
            </button>

            <button
              onClick={fetchCards}
              disabled={loadingStates.loading}
              className="px-6 py-3 bg-jade-100 text-jade-800 font-medium rounded-xl hover:bg-jade-200 transition-all duration-200 border border-jade-200 disabled:opacity-50"
            >
              {loadingStates.loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl ${messageType === 'success'
              ? 'bg-jade-100 text-jade-800 border border-jade-200'
              : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
            <p className="font-medium">{message}</p>
            <button
              onClick={() => setMessage('')}
              className="mt-2 text-sm underline opacity-75 hover:opacity-100"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Create Card Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-jade-800 mb-6">Create Virtual Card</h2>

              <form onSubmit={handleCreateCard} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-jade-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={createFormData.userName}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, userName: e.target.value }))}
                    className="w-full p-3 border border-jade-200 rounded-xl focus:ring-2 focus:ring-jade-500 focus:border-transparent"
                    placeholder="Enter cardholder name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-jade-700 mb-2">
                    Initial Amount
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={createFormData.amount}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full p-3 border border-jade-200 rounded-xl focus:ring-2 focus:ring-jade-500 focus:border-transparent"
                    placeholder="Enter amount"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-jade-700 mb-2">
                      Currency
                    </label>
                    <select
                      value={createFormData.currency}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full p-3 border border-jade-200 rounded-xl focus:ring-2 focus:ring-jade-500 focus:border-transparent"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-jade-700 mb-2">
                      Card Brand
                    </label>
                    <select
                      value={createFormData.cardBrand}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, cardBrand: e.target.value }))}
                      className="w-full p-3 border border-jade-200 rounded-xl focus:ring-2 focus:ring-jade-500 focus:border-transparent"
                    >
                      <option value="visa">Visa</option>
                      <option value="mastercard">Mastercard</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 px-4 py-3 text-jade-600 border border-jade-200 rounded-xl hover:bg-jade-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loadingStates.creating}
                    className="flex-1 px-4 py-3 bg-jade-600 text-white rounded-xl hover:bg-jade-700 transition-colors disabled:opacity-50"
                  >
                    {loadingStates.creating ? 'Creating...' : 'Create Card'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Top Up Card Modal */}
        {showTopupForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-jade-800 mb-6">Top Up Card</h2>

              <form onSubmit={handleTopupCard} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-jade-700 mb-2">
                    Select Card
                  </label>
                  <select
                    value={topupFormData.cardId}
                    onChange={(e) => setTopupFormData(prev => ({ ...prev, cardId: e.target.value }))}
                    className="w-full p-3 border border-jade-200 rounded-xl focus:ring-2 focus:ring-jade-500 focus:border-transparent"
                    required
                  >
                    <option value="">Choose a card...</option>
                    {cards.map((card) => (
                      <option key={card.id} value={card.id}>
                        {formatCardNumber(card.maskedCardNumber)} - {(card.cardBrand || 'VISA').toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-jade-700 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={topupFormData.amount}
                    onChange={(e) => setTopupFormData(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full p-3 border border-jade-200 rounded-xl focus:ring-2 focus:ring-jade-500 focus:border-transparent"
                    placeholder="Enter amount"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-jade-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={topupFormData.currency}
                    onChange={(e) => setTopupFormData(prev => ({ ...prev, currency: e.target.value }))}
                    className="w-full p-3 border border-jade-200 rounded-xl focus:ring-2 focus:ring-jade-500 focus:border-transparent"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowTopupForm(false)}
                    className="flex-1 px-4 py-3 text-jade-600 border border-jade-200 rounded-xl hover:bg-jade-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loadingStates.topup}
                    className="flex-1 px-4 py-3 bg-jade-600 text-white rounded-xl hover:bg-jade-700 transition-colors disabled:opacity-50"
                  >
                    {loadingStates.topup ? 'Processing...' : 'Top Up'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Cards Grid */}
        {loadingStates.loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                <div className="h-4 bg-jade-200 rounded mb-4"></div>
                <div className="h-6 bg-jade-200 rounded mb-2"></div>
                <div className="h-4 bg-jade-200 rounded mb-4"></div>
                <div className="h-10 bg-jade-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-jade-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-jade-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-jade-800 mb-2">No Virtual Cards</h3>
            <p className="text-jade-600 mb-6">You haven't created any virtual cards yet.</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-3 bg-jade-600 text-white font-medium rounded-xl hover:bg-jade-700 transition-colors"
            >
              Create Your First Card
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => (
              <div key={card.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-jade-600 to-jade-700 p-6 text-white">
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-sm opacity-90">Virtual Card</div>
                    <div className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                      {(card.cardBrand || 'VISA').toUpperCase()}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-2xl font-mono tracking-wider mb-2">
                      {formatCardNumber(card.maskedCardNumber)}
                    </div>
                    <div className="text-sm opacity-90">
                      Expires: {card.expiryDate ? new Date(card.expiryDate).toLocaleDateString() : 'MM/YY'}
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-xs opacity-75">Balance</div>
                      <div className="text-xl font-bold">
                        {formatCurrency(card.balance || 0, card.currency || 'USD')}
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${(card.status || 'active') === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {(card.status || 'ACTIVE').toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleManageCard(card.id, card.status === 'active' ? 'freeze' : 'unfreeze')}
                      disabled={loadingStates.managing[card.id]}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${card.status === 'active'
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                    >
                      {loadingStates.managing[card.id]
                        ? 'Processing...'
                        : card.status === 'active' ? 'Freeze' : 'Unfreeze'
                      }
                    </button>

                    <button
                      onClick={() => {
                        setTopupFormData(prev => ({ ...prev, cardId: card.id }))
                        setShowTopupForm(true)
                      }}
                      className="px-4 py-2 bg-jade-100 text-jade-800 rounded-lg font-medium hover:bg-jade-200 transition-colors"
                    >
                      Top Up
                    </button>
                  </div>

                  <div className="mt-4 pt-4 border-t border-jade-100">
                    <div className="text-xs text-jade-600">
                      Created: {card.createdAt ? new Date(card.createdAt).toLocaleDateString() : 'Unknown'}
                    </div>
                    <div className="text-xs text-jade-600">
                      Type: {card.cardType || 'Virtual'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
