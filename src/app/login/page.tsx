'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-jade py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block mb-6">
            <span className="text-4xl font-bold bg-gradient-jade-primary bg-clip-text text-transparent">
              Village SACCO
            </span>
          </Link>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-3 text-gray-600 text-lg">
            Sign in to your account to continue
          </p>
        </div>

        <div className="card">
          <div className="card-body">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="form-label text-jade-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="form-input"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="password" className="form-label text-jade-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="form-input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="status-error rounded-lg p-4">
                  <div className="flex items-center">
                    <span className="text-xl mr-2">⚠️</span>
                    <div className="text-sm font-medium">
                      {error}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full text-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="loading-spinner mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>

              <div className="text-center pt-4">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link href="/register" className="font-semibold text-jade-600 hover:text-jade-700 transition-colors">
                    Sign up here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Quick Login Info */}
        <div className="card bg-jade-50 border-jade-200">
          <div className="card-body text-center">
            <h3 className="text-lg font-semibold text-jade-800 mb-2">Demo Credentials</h3>
            <div className="text-sm text-jade-700 space-y-1">
              <p><strong>Admin:</strong> admin@villagesacco.com / admin123</p>
              <p className="text-xs text-jade-600">Use these credentials to test the admin features</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
