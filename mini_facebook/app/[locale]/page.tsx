'use client';

import {useState} from 'react';
import {Branding, HomeBackground, Login} from "@/components/home";
import {useTranslations} from "next-intl";

export default function Home() {
    const [isLogin, setIsLogin] = useState(true);
    const t = useTranslations("auth")

    return (
        <HomeBackground>

            {/* Main content */}
            <div className="relative z-10 w-full max-w-6xl">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left side - Branding */}
                    <Branding />

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
                                    {t("login")}
                                </button>
                                <button
                                    onClick={() => setIsLogin(false)}
                                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                                        !isLogin
                                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                            : 'text-slate-400 hover:text-slate-200'
                                    }`}
                                >
                                    {t("signUp")}
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
                                        {t("email")}
                                    </label>
                                    <input
                                        type="email"
                                        placeholder={t("emailPlaceholder")}
                                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-500 transition-all duration-200"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        {t("password")}
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-500 transition-all duration-200"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                                >
                                    {isLogin ? t("signIn") : t("createAccount")}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </HomeBackground>
    );
}