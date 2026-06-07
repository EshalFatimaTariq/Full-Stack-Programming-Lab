'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/utils/api';
import Link from 'next/link';

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await API.post('/auth/login', formData);
            if (response.data.success) {
                // Save token and user details to localStorage
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userRole', response.data.user.role);
                localStorage.setItem('userName', response.data.user.name);

                setMessage({ type: 'success', text: 'Login successful! Redirecting to dashboard...' });
                
                // Route to appropriate role dashboard
                setTimeout(() => {
                    const role = response.data.user.role;
                    if (role === 'Admin') router.push('/dashboard/admin');
                    else if (role === 'Doctor') router.push('/dashboard/doctor');
                    else router.push('/dashboard/patient');
                }, 1500);
            }
        } catch (error) {
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.message || 'Invalid email or password.' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
                
                {/* Branding Heading */}
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Sign in to access your digital healthcare files
                    </p>
                </div>

                {/* Toast feedback messages */}
                {message.text && (
                    <div className={`p-4 rounded-lg text-sm font-medium ${
                        message.type === 'success' 
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                        {message.text}
                    </div>
                )}

                {/* Login Form Body */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                            <input
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="name@healthcare.pk"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
                            <input
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 border border-transparent rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer disabled:bg-blue-400"
                        >
                            {loading ? 'Verifying Account...' : 'Sign In'}
                        </button>
                    </div>

                    <div className="text-center text-sm text-slate-600">
                        New to the system?{' '}
                        <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-500 underline">
                            Create an account here
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}