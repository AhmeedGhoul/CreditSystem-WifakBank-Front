'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import { ChevronLeftIcon } from '@/icons';
import { resetPassword } from '@/api/auth';

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const validatePassword = (pwd: string) => {
        if (pwd.length < 6) return 'Password must be at least 6 characters.';
        return '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!token) {
            setError('Missing or invalid token.');
            return;
        }

        const pwdError = validatePassword(password);
        if (pwdError) {
            setError(pwdError);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const res = await resetPassword({ password, token });
            setSuccessMessage(res.message || 'Password reset successful!');
        } catch (err: any) {
            setError(err.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col flex-1 lg:w-1/2 w-full">
            <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
                <Link
                    href="/signin"
                    className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                    <ChevronLeftIcon />
                    Back to Sign In
                </Link>
            </div>

            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                        Reset Password
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        Enter and confirm your new password below.
                    </p>

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="space-y-6">
                            <div>
                                <Label htmlFor="password">New Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    aria-invalid={!!error && (error.includes('Password') || error.includes('match'))}
                                    aria-describedby="password-error"
                                />
                            </div>

                            <div>
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    aria-invalid={!!error && error.includes('match')}
                                    aria-describedby="confirm-password-error"
                                />
                            </div>

                            {error && (
                                <div
                                    id="password-error"
                                    className="text-sm text-red-600 dark:text-red-400"
                                    role="alert"
                                >
                                    {error}
                                </div>
                            )}

                            {successMessage && (
                                <div
                                    className="text-sm text-green-600 dark:text-green-400"
                                    role="alert"
                                >
                                    {successMessage}
                                </div>
                            )}

                            <div>
                                <Button className="w-full" disabled={loading}>
                                    {loading ? 'Resetting...' : 'Reset Password'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
