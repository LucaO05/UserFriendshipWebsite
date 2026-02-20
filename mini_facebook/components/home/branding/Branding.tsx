import {useTranslations} from "next-intl";

export const Branding = () => {
    const t = useTranslations("branding")

    return (
        <div className="text-center lg:text-left space-y-6">
            <div className="inline-block">
                <h1 className="text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 tracking-tight">
                    {t("projectName")}
                </h1>
                <div
                    className="h-1 w-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full"/>
            </div>

            <p className="text-xl lg:text-2xl text-slate-300 font-light">
               {t("tagline")}
            </p>

            <div className="pt-4 space-y-3 text-slate-400">
                <div className="flex items-center gap-3 justify-center lg:justify-start">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"/>
                    <span>{t("feature1")}</span>
                </div>
                <div className="flex items-center gap-3 justify-center lg:justify-start">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-300"/>
                    <span>{t("feature2")}</span>
                </div>
                <div className="flex items-center gap-3 justify-center lg:justify-start">
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-700"/>
                    <span>{t("feature3")}</span>
                </div>
            </div>
        </div>
    )
}