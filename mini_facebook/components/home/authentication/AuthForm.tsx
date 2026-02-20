import {Login} from "@/components/home";
import {useState} from "react";
import {useTranslations} from "next-intl";
import {AuthSwitch} from "@/components/home/authentication/components/switch";

export const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const t = useTranslations("auth")

    return (
        <div className="w-full max-w-md mx-auto">
            <div
                className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8">
                <AuthSwitch isLogin={isLogin} setIsLogin={setIsLogin} />

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
    )
}