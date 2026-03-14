import {useState} from "react";
import {useTranslations} from "next-intl";
import type {SendRequestResponse} from "@/components/dashboard/types";

type AddFriendFormProps = {
  currentUsername: string;
  onRequestSent: () => void;
};

export function AddFriendForm({currentUsername, onRequestSent}: AddFriendFormProps) {
  const [targetUsername, setTargetUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const t = useTranslations("dashboard");

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/friends/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderUsername: currentUsername,
          targetUsername,
        }),
      });

      const data: SendRequestResponse = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || t("requestSendError"));
        return;
      }

      setTargetUsername("");
      setSuccess(t("requestSent"));
      onRequestSent();
    } catch {
      setError(t("requestSendError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-700/80 bg-slate-900/40 p-5">
      <p className="text-white font-semibold mb-3">{t("addFriendTitle")}</p>
      <p className="text-sm text-slate-300 mb-4">{t("addFriendHint")}</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={targetUsername}
          onChange={(event) => setTargetUsername(event.target.value)}
          placeholder={t("addFriendPlaceholder")}
          className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-5 py-3 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-medium hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 disabled:opacity-70"
        >
          {isSubmitting ? t("sending") : t("sendRequest")}
        </button>
      </div>
      {error && <p className="text-sm text-red-300 mt-3">{error}</p>}
      {success && <p className="text-sm text-emerald-300 mt-3">{success}</p>}
    </div>
  );
}
