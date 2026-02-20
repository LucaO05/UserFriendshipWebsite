import {useTranslations} from "next-intl";

export const Login = () => {
    const t = useTranslations("auth")

    return (
        <>
            <div className="animate-fadeIn">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    {t("username")}
                </label>
                <input
                    type="text"
                    placeholder={t("usernamePlaceholder")}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-500 transition-all duration-200"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    {t("firstname")}
                </label>
                <input
                    type="text"
                    placeholder={t("firstnamePlaceholder")}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-500 transition-all duration-200"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    {t("lastname")}
                </label>
                <input
                    type="text"
                    placeholder={t("lastnamePlaceholder")}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-500 transition-all duration-200"
                />
            </div>
        </>
    )
}