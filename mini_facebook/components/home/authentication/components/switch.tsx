import {useTranslations} from "next-intl";

type Props = {
    isLogin: boolean;
    setIsLogin: (value: boolean) => void;
};

export const AuthSwitch = ({ isLogin, setIsLogin }: Props) => {
    const t = useTranslations("auth")

    return (
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
    )
}