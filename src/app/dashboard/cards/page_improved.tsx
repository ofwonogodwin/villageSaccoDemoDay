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

export default function VirtualCardsImproved() {
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
                setMessage(`Card created successfully! ${result.message || ''}`)
                setMessageType('success')
                setShowCreateForm(false)
                setCreateFormData({ userName: '', amount: '', currency: 'USD', cardBrand: 'visa' })
                await fetchCards()
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
            setMessage('Please fill in all required fields')
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
                setMessage(`Card topped up successfully! ${result.message || ''}`)
                setMessageType('success')
                setShowTopupForm(false)
                setTopupFormData({ cardId: '', amount: '', currency: 'USD' })
                await fetchCards()
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
                await fetchCards()
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
        <div className="px-6 py-8 space-y-8">
            {/* Header - Cleaner design */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-bold gradient-text mb-3">Virtual Cards</h1>
                    <p className="text-xl text-gray-600">Create and manage your virtual debit cards for secure online transactions</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="btn-primary"
                    >
                        <span className="mr-2">💳</span>
                        Create New Card
                    </button>

                    <button
                        onClick={() => setShowTopupForm(true)}
                        className="btn-secondary"
                    >
                        <span className="mr-2">💰</span>
                        Top Up Card
                    </button>

                    <button
                        onClick={fetchCards}
                        disabled={loadingStates.loading}
                        className="btn-outline"
                    >
                        {loadingStates.loading ? (
                            <>
                                <div className="loading-spinner mr-2"></div>
                                Refreshing...
                            </>
                        ) : (
                            <>
                                <span className="mr-2">🔄</span>
                                Refresh
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Message Display - Better styling */}
            {message && (
                <div className={`p-4 rounded-xl border ${messageType === 'success'
                    ? 'bg-jade-50 text-jade-800 border-jade-200'
                    : 'bg-red-50 text-red-800 border-red-200'
                    } flex items-center justify-between space-x-3`}>
                    <div className="flex items-center space-x-3">
                        <span className="text-xl">
                            {messageType === 'success' ? '✅' : '❌'}
                        </span>
                        <span className="font-medium">{message}</span>
                    </div>
                    <button
                        onClick={() => setMessage('')}
                        className="text-sm opacity-75 hover:opacity-100 transition-opacity"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Create Card Modal - Cleaner design */}
            {showCreateForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-bold gradient-text">Create Virtual Card</h2>
                                <button
                                    onClick={() => setShowCreateForm(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleCreateCard} className="space-y-6">
                                <div>
                                    <label className="form-label">
                                        Cardholder Name
                                    </label>
                                    <input
                                        type="text"
                                        value={createFormData.userName}
                                        onChange={(e) => setCreateFormData(prev => ({ ...prev, userName: e.target.value }))}
                                        className="form-input"
                                        placeholder="Enter cardholder name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="form-label">
                                        Initial Amount (USD)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
                                        <input
                                            type="number"
                                            min="10"
                                            step="0.01"
                                            value={createFormData.amount}
                                            onChange={(e) => setCreateFormData(prev => ({ ...prev, amount: e.target.value }))}
                                            className="form-input pl-8"
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2">Minimum amount: $10.00</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="form-label">
                                            Currency
                                        </label>
                                        <select
                                            value={createFormData.currency}
                                            onChange={(e) => setCreateFormData(prev => ({ ...prev, currency: e.target.value }))}
                                            className="form-input"
                                        >
                                            <option value="USD">USD - US Dollar</option>
                                            <option value="EUR">EUR - Euro</option>
                                            <option value="GBP">GBP - British Pound</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="form-label">
                                            Card Brand
                                        </label>
                                        <select
                                            value={createFormData.cardBrand}
                                            onChange={(e) => setCreateFormData(prev => ({ ...prev, cardBrand: e.target.value }))}
                                            className="form-input"
                                        >
                                            <option value="visa">Visa</option>
                                            <option value="mastercard">Mastercard</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateForm(false)}
                                        className="flex-1 btn-outline"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loadingStates.creating}
                                        className="flex-1 btn-primary"
                                    >
                                        {loadingStates.creating ? (
                                            <div className="flex items-center justify-center">
                                                <div className="loading-spinner mr-2"></div>
                                                Creating...
                                            </div>
                                        ) : (
                                            'Create Card'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Up Modal */}
            {showTopupForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-bold gradient-text">Top Up Card</h2>
                                <button
                                    onClick={() => setShowTopupForm(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleTopupCard} className="space-y-6">
                                <div>
                                    <label className="form-label">
                                        Select Card
                                    </label>
                                    <select
                                        value={topupFormData.cardId}
                                        onChange={(e) => setTopupFormData(prev => ({ ...prev, cardId: e.target.value }))}
                                        className="form-input"
                                        required
                                    >
                                        <option value="">Choose a card to top up</option>
                                        {cards.map((card) => (
                                            <option key={card.id} value={card.id}>
                                                {formatCardNumber(card.maskedCardNumber)} - {(card.cardBrand || 'VISA').toUpperCase()}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="form-label">
                                        Top Up Amount
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
                                        <input
                                            type="number"
                                            min="1"
                                            step="0.01"
                                            value={topupFormData.amount}
                                            onChange={(e) => setTopupFormData(prev => ({ ...prev, amount: e.target.value }))}
                                            className="form-input pl-8"
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowTopupForm(false)}
                                        className="flex-1 btn-outline"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loadingStates.topup}
                                        className="flex-1 btn-primary"
                                    >
                                        {loadingStates.topup ? (
                                            <div className="flex items-center justify-center">
                                                <div className="loading-spinner mr-2"></div>
                                                Processing...
                                            </div>
                                        ) : (
                                            'Top Up Card'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Cards Grid */}
            <div className="section-spacing">
                {loadingStates.loading ? (
                    <div className="text-center py-16">
                        <div className="loading-spinner mx-auto mb-4"></div>
                        <p className="text-gray-600 text-lg">Loading your virtual cards...</p>
                    </div>
                ) : cards.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                            <span className="text-4xl text-gray-400">💳</span>
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Virtual Cards Yet</h3>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">Get started by creating your first virtual card for secure online payments.</p>
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="btn-primary"
                        >
                            <span className="mr-2">💳</span>
                            Create Your First Card
                        </button>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Cards ({cards.length})</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {cards.map((card) => (
                                <div key={card.id} className="card feature-card">
                                    <div className="card-body">
                                        {/* Card Visual */}
                                        <div className="bg-gradient-to-br from-jade-500 to-jade-700 p-6 rounded-xl text-white mb-6 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16"></div>
                                            <div className="relative z-10">
                                                <div className="flex justify-between items-start mb-8">
                                                    <span className="text-sm font-medium opacity-90">Virtual Card</span>
                                                    <span className="text-2xl font-bold">
                                                        {(card.cardBrand || 'VISA').toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="space-y-4">
                                                    <p className="text-2xl font-mono tracking-wider">
                                                        {formatCardNumber(card.maskedCardNumber)}
                                                    </p>
                                                    <div className="flex justify-between items-end">
                                                        <div>
                                                            <p className="text-xs opacity-75">BALANCE</p>
                                                            <p className="text-xl font-bold">
                                                                {formatCurrency(card.balance || 0, card.currency || 'USD')}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs opacity-75">STATUS</p>
                                                            <p className={`text-sm font-semibold px-2 py-1 rounded ${card.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                                                                }`}>
                                                                {card.status?.toUpperCase() || 'ACTIVE'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Actions */}
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleManageCard(card.id, card.status === 'active' ? 'freeze' : 'unfreeze')}
                                                disabled={loadingStates.managing[card.id]}
                                                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${card.status === 'active'
                                                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                                                    } disabled:opacity-50`}
                                            >
                                                {loadingStates.managing[card.id] ? (
                                                    <div className="flex items-center justify-center">
                                                        <div className="loading-spinner mr-2"></div>
                                                        Processing...
                                                    </div>
                                                ) : (
                                                    card.status === 'active' ? 'Freeze Card' : 'Unfreeze Card'
                                                )}
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setTopupFormData(prev => ({ ...prev, cardId: card.id }))
                                                    setShowTopupForm(true)
                                                }}
                                                className="flex-1 bg-jade-100 text-jade-800 px-4 py-3 rounded-xl font-medium hover:bg-jade-200 transition-colors"
                                            >
                                                Top Up
                                            </button>
                                        </div>

                                        {/* Card Details */}
                                        <div className="mt-6 pt-6 border-t border-gray-100 space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Created:</span>
                                                <span className="text-gray-900">{card.createdAt ? new Date(card.createdAt).toLocaleDateString() : 'Unknown'}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Type:</span>
                                                <span className="text-gray-900">{card.cardType || 'Virtual'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
