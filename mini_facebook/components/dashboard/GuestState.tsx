import Link from "next/link";
import {useTranslations} from "next-intl";
import {HomeBackground} from "@/components/home";

type GuestStateProps = {
  locale: string;
};

export function GuestState({locale}: GuestStateProps) {
  const t = useTranslations("dashboard");

  return (
    <HomeBackground>
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8 text-center">
          <h1 className="text-2xl font-bold mb-2 text-white">{t("notLoggedInTitle")}</h1>
          <p className="text-slate-300 mb-6">{t("notLoggedInText")}</p>
          <Link
            href={`/${locale}`}
            className="inline-flex px-5 py-3 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-medium hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-200"
          >
            {t("backToLogin")}
          </Link>
        </div>
      </div>
    </HomeBackground>
  );
}
