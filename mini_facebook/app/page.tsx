'use client';

import {useState} from 'react';
import {Login, HomeBackground} from "@/components/home/index";

export default function Home() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div

            {/* Main content */}
            <div className="relative z-10 w-full max-w-6xl">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left side - Branding */}
                    <div className="text-center lg:text-left space-y-6">
                        <div className="inline-block">
                            <h1 className="text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 tracking-tight">
                                mini facebook
                            </h1>
                            <div
                                className="h-1 w-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full"/>
                        </div>

                        <p className="text-xl lg:text-2xl text-slate-300 font-light">
                            the only good Social Media Plattform
                        </p>

                        <div className="pt-4 space-y-3 text-slate-400">
                            <div className="flex items-center gap-3 justify-center lg:justify-start">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"/>
                                <span>Connect with friends worldwide</span>
                            </div>
                            <div className="flex items-center gap-3 justify-center lg:justify-start">
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-300"/>
                                <span>Share your moments</span>
                            </div>
                            <div className="flex items-center gap-3 justify-center lg:justify-start">
                                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-700"/>
                                <span>Stay in touch</span>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Auth form */}
                    <div className="w-full max-w-md mx-auto">
                        <div
                            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8">
                            {/* Tab switcher */}
                            <div className="flex gap-2 mb-8 bg-slate-900/50 rounded-lg p-1">
                                <button
                                    onClick={() => setIsLogin(true)}
                                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                                        isLogin
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                                            : 'text-slate-400 hover:text-slate-200'
                                    }`}
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => setIsLogin(false)}
                                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                                        !isLogin
                                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                            : 'text-slate-400 hover:text-slate-200'
                                    }`}
                                >
                                    Sign Up
                                </button>
                            </div>

                            {/* Form */}
                            <form className="space-y-5">
                                {!isLogin && (
                                    <>
                                        <Login/>
                                    </>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-500 transition-all duration-200"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-500 transition-all duration-200"
                                    />
                                </div>

                                {isLogin && (
                                    <div className="flex items-center justify-between text-sm">
                                        <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                                            Forgot password?
                                        </a>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                                >
                                    {isLogin ? 'Sign In' : 'Create Account'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}