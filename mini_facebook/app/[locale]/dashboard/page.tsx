"use client";

import {useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {useTranslations} from "next-intl";
import Link from "next/link";

type StoredUser = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  createdAt: string;
};

function getStoredUser(): StoredUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawUser = localStorage.getItem("auth_user");

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as StoredUser;
  } catch {
    localStorage.removeItem("auth_user");
    return null;
  }
}

export default function DashboardPage() {
  const [user] = useState<StoredUser | null>(getStoredUser);
  const t = useTranslations("dashboard");
  const params = useParams<{locale: string}>();
  const router = useRouter();

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">{t("notLoggedInTitle")}</h1>
          <p className="text-slate-300 mb-6">{t("notLoggedInText")}</p>
          <Link
            href={`/${params.locale}`}
            className="inline-flex px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            {t("backToLogin")}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
        <p className="text-green-300 mb-6">{t("success")}</p>

        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="bg-slate-800 p-4 rounded-lg">
            <p className="text-slate-400">{t("firstName")}</p>
            <p className="font-semibold">{user.firstName}</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg">
            <p className="text-slate-400">{t("lastName")}</p>
            <p className="font-semibold">{user.lastName}</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg">
            <p className="text-slate-400">{t("username")}</p>
            <p className="font-semibold">{user.username}</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg">
            <p className="text-slate-400">{t("email")}</p>
            <p className="font-semibold">{user.email}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            localStorage.removeItem("auth_user");
            router.push(`/${params.locale}`);
          }}
          className="inline-flex mt-8 px-5 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
        >
          {t("logout")}
        </button>
      </div>
    </main>
  );
}