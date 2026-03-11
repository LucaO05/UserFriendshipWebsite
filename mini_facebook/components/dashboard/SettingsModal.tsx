import {useEffect, useState} from "react";
import {useTranslations} from "next-intl";
import type {SettingsResponse, StoredUser} from "@/components/dashboard/types";

type SettingsModalProps = {
  isOpen: boolean;
  user: StoredUser;
  onClose: () => void;
  onUserUpdated: (user: StoredUser) => void;
};

export function SettingsModal({isOpen, user, onClose, onUserUpdated}: SettingsModalProps) {
  const [newUsername, setNewUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [settingsSuccess, setSettingsSuccess] = useState<string | null>(null);
  const [isUsernameSaving, setIsUsernameSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);

  const t = useTranslations("dashboard");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setNewUsername(user.username);
    setOldPassword("");
    setNewPassword("");
    setSettingsError(null);
    setSettingsSuccess(null);
  }, [isOpen, user]);

  if (!isOpen) {
    return null;
  }

  const handleUsernameUpdate = async () => {
    setIsUsernameSaving(true);
    setSettingsError(null);
    setSettingsSuccess(null);

    try {
      const response = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "username",
          email: user.email,
          username: newUsername,
        }),
      });

      const data: SettingsResponse = await response.json();

      if (!response.ok || !data.success || !data.user) {
        setSettingsError(data.message || t("settingsGenericError"));
        return;
      }

      onUserUpdated(data.user);
      setSettingsSuccess(t("usernameUpdated"));
    } catch {
      setSettingsError(t("settingsGenericError"));
    } finally {
      setIsUsernameSaving(false);
    }
  };

  const handlePasswordUpdate = async () => {
    setIsPasswordSaving(true);
    setSettingsError(null);
    setSettingsSuccess(null);

    try {
      const response = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "password",
          email: user.email,
          oldPassword,
          newPassword,
        }),
      });

      const data: SettingsResponse = await response.json();

      if (!response.ok || !data.success) {
        setSettingsError(data.message || t("settingsGenericError"));
        return;
      }

      setOldPassword("");
      setNewPassword("");
      setSettingsSuccess(t("passwordUpdated"));
    } catch {
      setSettingsError(t("settingsGenericError"));
    } finally {
      setIsPasswordSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/75"
        onClick={onClose}
        aria-label={t("closeSettings")}
      />

      <div className="relative z-10 w-full max-w-2xl bg-slate-800/90 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{t("settings")}</h2>
          <button type="button" onClick={onClose} className="text-slate-300 hover:text-white">
            {t("close")}
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
            <p className="text-white font-semibold mb-3">{t("changeUsername")}</p>
            <label className="block text-sm text-slate-300 mb-2">{t("newUsername")}</label>
            <input
              type="text"
              value={newUsername}
              onChange={(event) => setNewUsername(event.target.value)}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            />
            <button
              type="button"
              onClick={handleUsernameUpdate}
              disabled={isUsernameSaving}
              className="mt-4 w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-medium hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 disabled:opacity-70"
            >
              {isUsernameSaving ? t("saving") : t("saveUsername")}
            </button>
          </div>

          <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
            <p className="text-white font-semibold mb-3">{t("changePassword")}</p>
            <label className="block text-sm text-slate-300 mb-2">{t("oldPassword")}</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(event) => setOldPassword(event.target.value)}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white mb-3"
            />
            <label className="block text-sm text-slate-300 mb-2">{t("newPassword")}</label>
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            />
            <button
              type="button"
              onClick={handlePasswordUpdate}
              disabled={isPasswordSaving}
              className="mt-4 w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-medium hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 disabled:opacity-70"
            >
              {isPasswordSaving ? t("saving") : t("savePassword")}
            </button>
          </div>
        </div>

        {settingsError && <p className="mt-4 text-sm text-red-300">{settingsError}</p>}
        {settingsSuccess && <p className="mt-4 text-sm text-emerald-300">{settingsSuccess}</p>}
      </div>
    </div>
  );
}
