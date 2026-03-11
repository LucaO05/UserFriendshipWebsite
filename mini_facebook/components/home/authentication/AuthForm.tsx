"use client";

import {FormEvent, useState} from "react";
import Link from "next/link";
import {useParams, useRouter} from "next/navigation";
import {useTranslations} from "next-intl";
import {Login} from "@/components/home";
import {AuthSwitch} from "@/components/home/authentication/components/switch";

type AuthApiResponse = {
  success: boolean;
  message: string;
  requiresVerification?: boolean;
  email?: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    isVerified: boolean;
    createdAt: string;
  };
};

export const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationEmail, setVerificationEmail] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerificationLoading, setIsVerificationLoading] = useState(false);
  const [isResendingCode, setIsResendingCode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [hasSession, setHasSession] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return Boolean(localStorage.getItem("auth_user"));
  });

  const t = useTranslations("auth");
  const router = useRouter();
  const params = useParams<{locale: string}>();
  const locale = params.locale ?? "de";

  const clearRegisterFields = () => {
    setUsername("");
    setFirstName("");
    setLastName("");
  };

  const openVerificationStep = (targetEmail: string, message?: string) => {
    setVerificationEmail(targetEmail);
    setVerificationCode("");
    setShowVerification(true);
    setError(null);
    setSuccessMessage(message ?? t("verificationCodeSent"));
  };

  const handleVerifyCode = async () => {
    setError(null);
    setSuccessMessage(null);
    setIsVerificationLoading(true);

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: verificationEmail,
          code: verificationCode,
        }),
      });

      const data: AuthApiResponse = await response.json();

      if (!response.ok || !data.success || !data.user) {
        if (data.requiresVerification && data.email) {
          setVerificationEmail(data.email);
        }

        setError(data.message || t("genericError"));
        return;
      }

      localStorage.setItem("auth_user", JSON.stringify(data.user));
      setHasSession(true);
      setShowVerification(false);
      router.push(`/${locale}/dashboard`);
    } catch {
      setError(t("genericError"));
    } finally {
      setIsVerificationLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError(null);
    setSuccessMessage(null);
    setIsResendingCode(true);

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: verificationEmail,
        }),
      });

      const data: AuthApiResponse = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || t("genericError"));
        return;
      }

      setSuccessMessage(t("verificationCodeResent"));
    } catch {
      setError(t("genericError"));
    } finally {
      setIsResendingCode(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    const submittingLogin = isLogin;

    try {
      const endpoint = submittingLogin ? "/api/auth/login" : "/api/auth/register";
      const payload = submittingLogin
        ? {identifier: email, password}
        : {firstName, lastName, username, email, password};

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data: AuthApiResponse = await response.json();

      if (!response.ok || !data.success || !data.user) {
        if (data.requiresVerification && data.email) {
          openVerificationStep(data.email, data.message);
          return;
        }

        setError(data.message || t("genericError"));
        return;
      }

      if (submittingLogin) {
        localStorage.setItem("auth_user", JSON.stringify(data.user));
        setEmail("");
        setPassword("");
        setHasSession(true);
        router.push(`/${locale}/dashboard`);
        return;
      }

      clearRegisterFields();
      setPassword("");
      openVerificationStep(data.email ?? data.user.email, data.message);
    } catch {
      setError(t("genericError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8">
        {showVerification ? (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold text-white">{t("verifyTitle")}</h2>
            <p className="text-sm text-slate-300">{t("verifyText", {email: verificationEmail})}</p>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">{t("verificationCode")}</label>
              <input
                type="text"
                value={verificationCode}
                onChange={(event) => setVerificationCode(event.target.value)}
                placeholder="123456"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>

            {error && <p className="text-sm text-red-300">{error}</p>}
            {successMessage && <p className="text-sm text-emerald-300">{successMessage}</p>}

            <button
              type="button"
              onClick={handleVerifyCode}
              disabled={isVerificationLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-70"
            >
              {isVerificationLoading ? t("loading") : t("verifyButton")}
            </button>

            <button
              type="button"
              onClick={handleResendCode}
              disabled={isResendingCode}
              className="w-full py-3 px-4 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium transition-colors disabled:opacity-70"
            >
              {isResendingCode ? t("loading") : t("resendCode")}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowVerification(false);
                setVerificationCode("");
                setError(null);
                setSuccessMessage(null);
              }}
              className="w-full py-2 text-sm text-slate-300 hover:text-white"
            >
              {t("backToAuth")}
            </button>
          </div>
        ) : (
          <>
            <AuthSwitch isLogin={isLogin} setIsLogin={setIsLogin} />

            <form className="space-y-5" onSubmit={handleSubmit}>
              {!isLogin && (
                <Login
                  username={username}
                  firstName={firstName}
                  lastName={lastName}
                  onUsernameChange={setUsername}
                  onFirstNameChange={setFirstName}
                  onLastNameChange={setLastName}
                />
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {isLogin ? t("loginIdentifier") : t("email")}
                </label>
                <input
                  type={isLogin ? "text" : "email"}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={isLogin ? t("loginIdentifierPlaceholder") : t("emailPlaceholder")}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">{t("password")}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-500 transition-all duration-200"
                />
              </div>

              {error && <p className="text-sm text-red-300">{error}</p>}
              {successMessage && <p className="text-sm text-emerald-300">{successMessage}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? t("loading") : isLogin ? t("signIn") : t("createAccount")}
              </button>
            </form>

            {hasSession && (
              <div className="mt-5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                <p className="mb-3">{t("alreadyLoggedIn")}</p>
                <Link
                  href={`/${locale}/dashboard`}
                  className="inline-flex rounded-md bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700 transition-colors"
                >
                  {t("goToDashboard")}
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
