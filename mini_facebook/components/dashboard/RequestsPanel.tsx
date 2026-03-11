import {useTranslations} from "next-intl";
import type {IncomingRequest} from "@/components/dashboard/types";

type RequestsPanelProps = {
  requests: IncomingRequest[];
  isLoading: boolean;
  error: string | null;
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
  isSubmittingRequestId: string | null;
};

export function RequestsPanel({
  requests,
  isLoading,
  error,
  onAccept,
  onReject,
  isSubmittingRequestId,
}: RequestsPanelProps) {
  const t = useTranslations("dashboard");

  return (
    <div id="friend-requests" className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-5">
      <p className="text-amber-100 font-semibold mb-3">{t("incomingRequestsTitle")}</p>
      {isLoading && <p className="text-amber-100/80 text-sm">{t("requestsLoading")}</p>}
      {error && <p className="text-red-300 text-sm">{error}</p>}
      {!isLoading && !error && requests.length === 0 && (
        <p className="text-amber-100/80 text-sm">{t("requestsEmpty")}</p>
      )}
      {!isLoading && !error && requests.length > 0 && (
        <div className="space-y-3">
          {requests.map((request) => (
            <div key={request.id} className="rounded-lg border border-amber-300/30 bg-slate-900/40 p-4">
              <p className="text-white font-semibold">{request.sender.firstName} {request.sender.lastName}</p>
              <p className="text-sm text-slate-300">{request.sender.username}</p>
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => onAccept(request.id)}
                  disabled={isSubmittingRequestId === request.id}
                  aria-label={t("acceptRequest")}
                  className="w-10 h-10 rounded-lg bg-emerald-600 text-white text-lg font-bold hover:bg-emerald-700 disabled:opacity-70"
                >
                  ✓
                </button>
                <button
                  type="button"
                  onClick={() => onReject(request.id)}
                  disabled={isSubmittingRequestId === request.id}
                  aria-label={t("rejectRequest")}
                  className="w-10 h-10 rounded-lg bg-slate-700 text-white text-lg font-bold hover:bg-slate-600 disabled:opacity-70"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
