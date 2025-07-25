'use client';

import { useState, useEffect } from 'react';

interface ConfigStatus {
  hasBaseUrl: boolean;
  hasSecretKey: boolean;
  hasLightningKey: boolean;
  hasHmacPublicKey: boolean;
  hasWebhookSecret: boolean;
  hasClientId: boolean;
  cardServiceInitialized: boolean;
  transferServiceInitialized: boolean;
  webhookServiceInitialized: boolean;
  baseUrl: string;
  environment: string;
}

interface TestResult {
  success: boolean;
  message: string;
  data?: {
    configuration: ConfigStatus;
    status: {
      ready: boolean;
      missingCredentials: string[];
    };
  };
}

export default function BitnobConfigPage() {
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/bitnob/test-connection');
      const result = await response.json();
      setTestResult(result);
    } catch (error) {
      console.error('Connection test failed:', error);
      setTestResult({
        success: false,
        message: 'Failed to test connection'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ) : (
      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  };

  return (
    <div className="px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bitnob API Configuration</h1>
        <p className="text-gray-600">Test and verify your Bitnob API configuration and credentials.</p>
      </div>

      {/* Test Connection Button */}
      <div className="mb-8">
        <button
          onClick={testConnection}
          disabled={isLoading}
          className={`btn-primary ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Testing Connection...
            </>
          ) : (
            '🔄 Test Connection'
          )}
        </button>
      </div>

      {/* Test Results */}
      {testResult && (
        <div className="space-y-6">
          {/* Overall Status */}
          <div className={`card ${testResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <div className="card-body">
              <div className="flex items-center">
                {getStatusIcon(testResult.success)}
                <div className="ml-3">
                  <h3 className={`text-lg font-semibold ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
                    {testResult.success ? 'Configuration Valid' : 'Configuration Issues'}
                  </h3>
                  <p className={`text-sm ${testResult.success ? 'text-green-600' : 'text-red-600'}`}>
                    {testResult.message}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Configuration */}
          {testResult.data && (
            <>
              {/* Environment Variables */}
              <div className="card">
                <div className="card-body">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Environment Variables</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Base URL</span>
                      <div className="flex items-center">
                        {getStatusIcon(testResult.data.configuration.hasBaseUrl)}
                        <span className="ml-2 text-sm text-gray-600">
                          {testResult.data.configuration.baseUrl || 'Not configured'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Secret Key</span>
                      <div className="flex items-center">
                        {getStatusIcon(testResult.data.configuration.hasSecretKey)}
                        <span className="ml-2 text-sm text-gray-600">
                          {testResult.data.configuration.hasSecretKey ? 'Configured' : 'Missing'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Lightning Key</span>
                      <div className="flex items-center">
                        {getStatusIcon(testResult.data.configuration.hasLightningKey)}
                        <span className="ml-2 text-sm text-gray-600">
                          {testResult.data.configuration.hasLightningKey ? 'Configured' : 'Missing'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">HMAC Public Key</span>
                      <div className="flex items-center">
                        {getStatusIcon(testResult.data.configuration.hasHmacPublicKey)}
                        <span className="ml-2 text-sm text-gray-600">
                          {testResult.data.configuration.hasHmacPublicKey ? 'Configured' : 'Missing'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Webhook Secret</span>
                      <div className="flex items-center">
                        {getStatusIcon(testResult.data.configuration.hasWebhookSecret)}
                        <span className="ml-2 text-sm text-gray-600">
                          {testResult.data.configuration.hasWebhookSecret ? 'Configured' : 'Missing'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Client ID</span>
                      <div className="flex items-center">
                        {getStatusIcon(testResult.data.configuration.hasClientId)}
                        <span className="ml-2 text-sm text-gray-600">
                          {testResult.data.configuration.hasClientId ? 'Configured' : 'Missing'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Status */}
              <div className="card">
                <div className="card-body">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Card Service</span>
                      {getStatusIcon(testResult.data.configuration.cardServiceInitialized)}
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Transfer Service</span>
                      {getStatusIcon(testResult.data.configuration.transferServiceInitialized)}
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Webhook Service</span>
                      {getStatusIcon(testResult.data.configuration.webhookServiceInitialized)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Missing Credentials Alert */}
              {testResult.data.status.missingCredentials.length > 0 && (
                <div className="card border-yellow-200 bg-yellow-50">
                  <div className="card-body">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-yellow-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <div className="ml-3">
                        <h3 className="text-sm font-semibold text-yellow-800">Missing Credentials</h3>
                        <p className="text-sm text-yellow-700 mt-1">
                          The following environment variables are missing:
                        </p>
                        <ul className="list-disc list-inside mt-2 text-sm text-yellow-700">
                          {testResult.data.status.missingCredentials.map((credential, index) => (
                            <li key={index}>{credential}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Ready Status */}
              {testResult.data.status.ready && (
                <div className="card border-green-200 bg-green-50">
                  <div className="card-body">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div className="ml-3">
                        <h3 className="text-sm font-semibold text-green-800">System Ready</h3>
                        <p className="text-sm text-green-700">
                          All required services are initialized and ready for use.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
